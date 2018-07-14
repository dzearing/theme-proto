import { IThemeModuleProps, IBaseState } from "./ICoreTypes";
import { IBaseLayer } from "./ICoreTypes";

const rawStyleKey = 'settings';
const themeModules: { [key: string]: IThemeModuleProps } = {};
const moduleArray: IThemeModuleProps[] = [];

function resolveModuleProps(props: Partial<IThemeModuleProps>): IThemeModuleProps {
  return {
    name: props.name || 'bogus',
    default: props.default || {},
    dependsOn: props.dependsOn,
    resolveDef: props.resolveDef || resolveThemeDefinition,
    updateSettings: props.updateSettings
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
 *  default layer:
 *    allowPartial: false, parent: undefined, return a fully resolved layer
 *  named layer:
 *    allowPartial: false, parent: defaultStyle, return fully resolved layer
 *  state:
 *    allowPartial: true, parent: base layer, return only properties mapped to definition
 * 
 * @param name name of the module.  This corresponds to its key value in the theme layer
 * @param _obj layer or state that is being constructed.  If the module has a dependency that
 * is guaranteed to be resolved first.  Note that states are partial so in that case the
 * parent should be referenced.
 * @param defaultDef default definition to use for default layers
 * @param allowPartial if true this is a state which is a partial or empty set of properties.
 * If false this should be a full object with all required props accounted for. 
 * @param definition Partial definition object that defines the changes to this layer or the overrides
 * for the state
 * @param parent null for default layer, default layer for one-off layers, parent layer for states
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
  return Object.assign({}, base, definition);
}

/**
 * Take the definitions for the layer or state and build up the resolved layer or state
 * @param definitions agreggated set of definitions to apply to this layer or state
 * @param allowPartial whether we need a full definition (layer) or a partial one (state)
 * @param parent for a layer either null if default or the default layer if not.  For state
 * the parent state.
 */
export function createLayerOrState(
  definitions: object,
  allowPartial: boolean,
  parent?: object
): any {
  const results: IBaseState = { settings: {} };

  // go through the modules of note in the order they appear in the array
  for (const module of moduleArray) {
    const name = module.name;
    const def = definitions[name];
    if (!allowPartial || def) {
      results[name] = module.resolveDef(name, results, module.default, allowPartial, def, parent);
    }
    if (results[name] && module.updateSettings) {
      results.settings = module.updateSettings(results.settings!, results[name]);
    }
  }

  return results;
}

/**
 * For a given layer and a base settings object, allows the modules to apply overrides to the settings.  This will
 * be called once with a null parameter at layer creation time.  When layer is requested if the optional parameter is specified it
 * will be called at that time but only for the modules that have parameters
 * @param layer current layer being adjusted
 * @param settings props object for the layer
 * @param keysToTraverse key array to use for traversal.  Typically called with the modules but called by state creation
 * to build the initial decorated layers with the definition set.
 * @param modules optional parameters to modify the returned props at runtime
 */
export function adjustSettings(layer: IBaseLayer, settings: object, keysToTraverse: object, modules?: { [key: string]: object }): object {
  for (const key in keysToTraverse) {
    if (keysToTraverse.hasOwnProperty(key) && layer[key] && themeModules.hasOwnProperty(key)) {
      const layerDef = layer[key];
      const updateSettings = themeModules[key].updateSettings;
      const thisModule = modules ? modules[key] : undefined;
      if (updateSettings) {
        settings = updateSettings(settings, layerDef, thisModule);
      }
    }
  }
  return settings;
}
