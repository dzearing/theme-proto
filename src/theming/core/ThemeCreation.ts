import { createLayerOrState } from "./ThemeModule";
import { mergeObjects } from "./mergeObjects";
import { IBaseTheme, IBaseLayer, IBaseLayerDef, IBaseThemeDef } from "./ICoreTypes";

const defKey = 'definition';
const defaultName = 'default';

/**
 * Core theme creation function
 * @param definition settings for the new theme to create
 * @param parentTheme optional parent theme to use as a baseline.  Primarily used for creating
 * runtime theme overrides where the theme definition is only partially specified
 */
export function createThemeCore<IThemeDef extends IBaseThemeDef, ITheme extends IBaseTheme>(
  definition: IThemeDef,
  parentTheme?: ITheme
): ITheme {
  // start with the base style definition
  const baseLayer = createLayerOrState(definition, false, parentTheme);
  const newDef = parentTheme && parentTheme.hasOwnProperty(defKey)
    ? mergeObjects(parentTheme[defKey], definition)
    : definition;
  const layerDefinitions = newDef.layers || {};
  const baseStateDef = newDef.states || {};

  return {
    ...baseLayer,
    definition: newDef,
    layers: Object.keys(layerDefinitions).reduce((layers, layerName) => {
      layers[layerName] = () => {
        const base = { states: baseStateDef };
        const layerDef = mergeObjects(base, aggregateLayerDefinition(layerDefinitions, layerName));
        return createLayerOrState(layerDef, false, baseLayer);
      }
      return layers;
    }, {}),
  };
}

function aggregateLayerDefinition<IThemeLayerDefinition extends IBaseLayerDef>(
  layerDefinitions: { [key: string]: Partial<IThemeLayerDefinition> },
  layerName: string
): Partial<IThemeLayerDefinition> {
  if (layerDefinitions.hasOwnProperty(layerName)) {
    const layerDef = layerDefinitions[layerName];
    if (layerDef.parent) {
      return mergeObjects(aggregateLayerDefinition(layerDefinitions, layerDef.parent!), layerDef);
    }
    return layerDef;
  }
  return {};
}

/**
 * Get a resolved style from the theme.  If it was not already resolved this will make sure it gets
 * resolved.
 * @param theme Theme from which to obtain the style
 * @param name Name of the style to obtain.  If undefined it is the equivalent of default
 */
export function getThemeLayerCore<ITheme extends IBaseTheme & ILayer, ILayer extends IBaseLayer>(
  theme: ITheme,
  name?: string
): ILayer {
  const layers = theme.layers;
  if (layers && name && name !== defaultName && layers.hasOwnProperty(name)) {
    const layerVal = layers[name];
    if (typeof layerVal === 'function') {
      // if this is a factory function call the function to resolve the style
      layers[name] = layerVal();
    }
    return layers[name] as ILayer;
  }
  // failing a name lookup (or if we just want the default) return the base theme, which extends IStyle by definition
  return theme;
}
