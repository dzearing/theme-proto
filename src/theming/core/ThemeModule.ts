import { IThemeModuleProps } from "./ICoreTypes";
import { mergeObjects } from "./mergeObjects";
import { IBaseStyle } from "./ICoreTypes";

const rawStyleKey = 'props';
const themeModules: { [key: string]: IThemeModuleProps } = {};
const moduleArray: IThemeModuleProps[] = [];

function resolveModuleProps(props: Partial<IThemeModuleProps>): IThemeModuleProps {
  return {
    name: props.name || 'bogus',
    default: props.default || {},
    dependsOn: props.dependsOn,
    resolveDef: props.resolveDef || resolveThemeDefinition,
    updateProps: props.updateProps
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
 * @param name name of the module.  This corresponds to its key value in the theme style
 * @param _obj style or state that is being constructed.  If the module has a dependency that
 * is guaranteed to be resolved first.  Note that states are partial so in that case the
 * parent should be referenced.
 * @param defaultDef default definition to use for default styles
 * @param allowPartial if true this is a state which is a partial or empty set of properties.
 * If false this should be a full object with all required props accounted for. 
 * @param definition Partial definition object that defines the changes to this style or the overrides
 * for the state
 * @param parent null for default style, default style for one-off styles, parent style for states
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
    if (results[name] && module.updateProps) {
      results.props = module.updateProps(results[rawStyleKey], results[name]);
    }
  }

  return results;
}

/**
 * For a given style and a base props object, allows the modules to apply overrides to the properties.  This will
 * be called once with a null parameter at style creation time.  When style is requested if the optional parameter is specified it
 * will be called at that time but only for the modules that have parameters
 * @param style current style being adjusted
 * @param props props object for the style
 * @param keysToTraverse key array to use for traversal.  Typically called with the modules but called by state creation
 * to build the initial decorated styles with the definition set.
 * @param modules optional parameters to modify the returned props at runtime
 */
export function adjustStyleProps(style: IBaseStyle, props: object, keysToTraverse: object, modules?: { [key: string]: object }): object {
  for (const key in keysToTraverse) {
    if (keysToTraverse.hasOwnProperty(key) && style[key] && themeModules.hasOwnProperty(key)) {
      const styleDef = style[key];
      const updateStyle = themeModules[key].updateProps;
      const thisModule = modules ? modules[key] : undefined;
      if (updateStyle) {
        props = updateStyle(props, styleDef, thisModule);
      }
    }
  }
  return props;
}
