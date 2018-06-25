import { IThemeModuleProps, ThemeValueResolver, IThemeValueRequests, ThemeDefinitionResolver, ThemeStringHandler } from "./IThemeModule";
import { mergeObjects } from "../core/mergeObjects";
import { baseStructure } from "../core/baseStructure";

const themePlugins: { [key: string]: IThemeModuleProps } = {};

const stringChangeHandlers: ThemeStringHandler[] = [];

/**
 * This registers the theme module, as you would expect, from something called registerThemeModule...
 * @param props module props that configure behavior of this module
 */
export function registerThemeModule(props: IThemeModuleProps) {
  if (!themePlugins.hasOwnProperty(props.name)) {
    themePlugins[props.name] = props;
    if (props.stringConfig) {
      stringChangeHandlers.push(props.stringConfig);
    }
  }
}

function isReserved(name: string): boolean {
  return baseStructure.hasOwnProperty(name);
}

const defaultProps: IThemeModuleProps = {
  name: '',
  resolveDef: resolveThemeDefinition,
  resolveValue: defaultValueResolver,
  default: {}
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
  _obj: any,
  defaultDef: any,
  allowPartial: boolean,
  definition?: any,
  parent?: any
): any {
  if (allowPartial && !definition) {
    return definition;
  }
  const base = parent || defaultDef;
  return mergeObjects(base, definition);
}

/**
 * Take the definitions for the style or state and build up the resolved style or state
 * @param definitions agreggated set of definitions to apply to this style or state
 * @param allowPartial whether we need a full definition (style) or a partial one (state)
 * @param parent for a style either null if default or the default style if not.  For state
 * the parent state.
 */
export function resolveDefinitions(
  definitions: object,
  allowPartial: boolean,
  parent?: object
): any {
  const done: { [key: string]: boolean } = {};
  const results = {};

  // if we have a parent loop through that
  if (parent) {
    for (const key in parent) {
      if (parent.hasOwnProperty(key) && !isReserved(key)) {
        resolveDefToResults(key, results, done, definitions, allowPartial, parent);
      }
    }
  }

  // now loop through any definitions
  for (const key in definitions) {
    if (definitions.hasOwnProperty(key) && !isReserved(key)) {
      resolveDefToResults(key, results, done, definitions, allowPartial, parent);
    }
  }

  if (!allowPartial) {
    // finally create values for any registered plugins that haven't been done already
    for (const key in themePlugins) {
      if (themePlugins.hasOwnProperty(key) && !done[key]) {
        resolveDefToResults(key, results, done, definitions, false);
      }
    }
  }

  return results;
}

function resolveDefToResults(
  name: string,
  results: any,
  done: { [key: string]: boolean },
  definitions: object,
  allowPartial: boolean,
  parent?: object
): void {
  if (!done[name]) {
    done[name] = true;
    const entry = themePlugins.hasOwnProperty(name) ? themePlugins[name] : defaultProps;
    if (entry.dependsOn) {
      for (const dependency of entry.dependsOn) {
        if (!done[dependency]) {
          resolveDefToResults(dependency, results, done, definitions, allowPartial, parent);
        }
      }
    }
    const resolver: ThemeDefinitionResolver = entry.resolveDef || resolveThemeDefinition;
    const def = definitions[name];
    const par = parent ? parent[name] : undefined;
    results[name] = resolver(results, entry.default, allowPartial, def, par);
  }
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
  if (themePlugins.hasOwnProperty(moduleName)) {
    const entry = themePlugins[moduleName];
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
