import { IThemeModuleProps, ThemeValueResolver, IThemeValueRequests, ThemeStringHandler } from "./IThemeModule";
import { mergeObjects } from "../core/mergeObjects";
import { IRawStyle } from "@uifabric/styling";
import { IBaseStyle } from "../core/baseStructure";

const rawStyleKey = 'props';
const themeModules: { [key: string]: IThemeModuleProps } = {};
const moduleArray: IThemeModuleProps[] = [];
const stringChangeHandlers: ThemeStringHandler[] = [];

function resolveModuleProps(props: Partial<IThemeModuleProps>): IThemeModuleProps {
  return {
    name: props.name || 'bogus',
    default: props.default || {},
    dependsOn: props.dependsOn,
    resolveDef: props.resolveDef || resolveThemeDefinition,
    resolveValue: props.resolveValue || defaultValueResolver,
    stringConfig: props.stringConfig,
    updateStyle: props.updateStyle
  }
}

/**
 * This registers the theme module, as you would expect, from something called registerThemeModule...
 * @param props module props that configure behavior of this module
 */
export function registerThemeModule(props: Partial<IThemeModuleProps>) {
  const name = props.name;
  if (!name) {
    throw Error('Theme modules require a name property');
  }
  if (name !== rawStyleKey && !themeModules.hasOwnProperty(rawStyleKey)) {
    registerThemeModule({ name: rawStyleKey });
  }
  if (!themeModules.hasOwnProperty(name)) {
    const newProps = resolveModuleProps(props);
    themeModules[name] = newProps;
    if (props.stringConfig) {
      stringChangeHandlers.push(props.stringConfig);
    }

    const length = moduleArray.length;
    let newPos = length;
    for (let i = 0; i < length && newPos === length; i++) {
      const dependencies = moduleArray[i].dependsOn;
      if (dependencies && dependencies.indexOf(name) > -1) {
        newPos = i;
      }
    }
    if (newPos < length) {
      moduleArray.splice(newPos, 0, newProps);
    } else {
      moduleArray.push(newProps);
    }
  }
}

/**
 * Standard function to resolve a theme definition into a theme object.  In the case where no
 * override is present this will simply merge properties together.  This is called in the
 * following scenarios:
 * 
 *  default style:
 *    allowPartial: false, parent: undefined, return a fully resolved style
 *  named style:
 *    allowPartial: false, parent: defaultStyle, return fully resolved style
 *  state:
 *    allowPartial: true, parent: base style, return only properties mapped to definition
 * 
 * @param _obj base style or object that is being constructed.  If this is a style it will
 * be the style that is being built up.  If it is a state it will be the parent style
 * @param defaultDef default definition to use for default styles
 * @param allowPartial if true this is a state which is a partial or empty set of properties.
 * If false this should be a full object with all required props accounted for
 * @param definition Partial definition object that defines the changes to this style or the overrides
 * for the state
 * @param parent default style for a style variant or base style for a state
 */
export function resolveThemeDefinition(
  name: string,
  _obj: any,
  defaultDef: any,
  allowPartial: boolean,
  definition?: any,
  parent?: any
): any {
  if (allowPartial && !definition) {
    return definition;
  }
  const base = (parent && parent[name]) ? parent[name] : defaultDef;
  return mergeObjects(base, definition);
}

/**
 * Take the definitions for the style or state and build up the resolved style or state
 * @param definitions agreggated set of definitions to apply to this style or state
 * @param allowPartial whether we need a full definition (style) or a partial one (state)
 * @param parent for a style either null if default or the default style if not.  For state
 * the parent state.
 */
export function createStyleOrState(
  definitions: object,
  allowPartial: boolean,
  parent?: object
): any {
  const results = { [rawStyleKey]: {} };

  // go through the modules of note in the order they appear in the array
  for (const module of moduleArray) {
    const name = module.name;
    const def = definitions[name];
    if (!allowPartial || def) {
      results[name] = module.resolveDef(name, results, module.default, allowPartial, def, parent);
    }
    if (results[name] && module.updateStyle) {
      results.props = module.updateStyle(results[rawStyleKey], results[name]);
    }
  }

  return results;
}

export function adjustStyleProps(style: IBaseStyle, rawStyle: IRawStyle, modules: { [key: string]: object }): IRawStyle {
  for (const key in modules) {
    if (modules.hasOwnProperty(key) && style[key] && themeModules.hasOwnProperty(key)) {
      const styleDef = style[key];
      const updateStyle = themeModules[key].updateStyle;
      if (updateStyle) {
        rawStyle = updateStyle(rawStyle, styleDef, modules[key]);
      }
    }
  }
  return rawStyle;
}

/**
 * Performs value mapping for a given value request
 * @param moduleName name of the module, used to look up the resolver function
 * @param values set of potential values to use for lookup purposes
 * @param request requested values to extract
 */
export function resolveValues(moduleName: string, values: object, request: IThemeValueRequests): any {
  const resolver: ThemeValueResolver = getValueResolver(moduleName);
  const result = {};
  for (const key in request) {
    if (request.hasOwnProperty(key)) {
      const entry = request[key];
      const valueName = typeof entry === 'string' ? entry : entry.value;
      if (values.hasOwnProperty(valueName)) {
        const mod = typeof entry !== 'string' ? entry.mod : undefined;
        result[key] = resolver(values[valueName], mod);
      }
    }
  }
  return result;
}

function defaultValueResolver(val: any, mod?: string): any {
  return val;
}

function getValueResolver(moduleName: string): ThemeValueResolver {
  if (themeModules.hasOwnProperty(moduleName)) {
    const entry = themeModules[moduleName];
    if (entry.resolveValue) {
      return entry.resolveValue;
    }
  }
  return defaultValueResolver;
}

/**
 * This iterates through plugins that have string change handlers to build up an override
 * definition based on an input string.  This will return the number of handled terms and modify
 * the definition in place.
 * @param theme Current theme to modify for reference
 * @param definition New definition that is being built up, this should be modified in place
 * @param term Parse term being evaluated
 * @param param Optional parameter (basically the next parse term if available)
 */
export function handleStringChange(
  theme: object,
  definition: object,
  term: string,
  param?: string
): number {
  for (const handler of stringChangeHandlers) {
    const result = handler(theme, definition, term, param);
    if (result !== 0) {
      return result;
    }
  }
  return 0;
}
