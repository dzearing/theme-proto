import { IThemeStyle } from "./IThemeStyle";
import { ITheme, IThemeCache } from "./ITheme";
import { resolveKey } from "./IColorLayerKey";
import { styleBaseline } from "./themes/DefaultLight";
import { IColorLayer } from "./IColorLayer";
import { getLayerFromKeys } from "./ThemeColors";
import { IThemeSettings } from "./IThemeSettings";

const defName: string = 'default';

/**
 * Get the style for the requested theme.  This will be a fully resolved style, already
 * accounting for inherited properties.  The result will be cached for faster lookup
 * on the second go around.
 * @param theme theme to query the style from
 * @param styleName name of the style.  If not found or blank this will return default
 */
export function getThemeStyle(theme: ITheme, styleName?: string): IThemeStyle {
  const styleCache = theme.cache.styles;

  // looking for the default style?  Just return it directly.  It should start resolved.
  if (!styleName || styleName === defName) {
    return styleCache.default;
  }

  // already in the cache?  Return that
  if (styleCache.hasOwnProperty(styleName)) {
    return styleCache[styleName];
  }

  // this style has to be resolved so go look for the definition from the settings
  const styles = theme.styles;
  if (styles.hasOwnProperty(styleName)) {
    const thisStyle = styles[styleName];
    const parentStyle = getThemeStyle(theme, thisStyle.parent);
    const oneOffs: Partial<IThemeStyle> = { };
    if (thisStyle.key) {
      oneOffs.key = resolveKey(thisStyle.key, parentStyle.key);
    }
    // now put the joined object in the cache for quick lookups in the future
    const newStyle = Object.assign({}, parentStyle, thisStyle, oneOffs);
    styleCache[styleName] = newStyle;
    return newStyle;
  }

  // failing everything just return the default
  return getThemeStyle(theme);
}

/**
 * Get the color layer for the given style.
 * @param theme theme to extract settings from
 * @param styleName style name to get the layer for.  If not in the cache will obtain this via the style
 */
export function getThemeLayer(theme: ITheme, styleName?: string): IColorLayer {
  const layers = theme.cache.layers;
  if (!styleName) {
    styleName = defName;
  }
  if (layers.hasOwnProperty(styleName)) {
    return layers[styleName];
  }

  const style = getThemeStyle(theme, styleName);
  const layer = getLayerFromKeys(style.key, style.key, theme);
  layers[styleName] = layer;
  return layer;
}

/**
 * Create the style cache when creating a new theme.  This will pull what it can from
 * settings.
 * @param settings theme settings to use to initialize the cache
 */
export function createThemeCache(settings: Partial<IThemeSettings>): IThemeCache {
  const defaultStyleDefinition = settings.styles ? settings.styles.default : undefined;
  const defaultStyle: IThemeStyle = Object.assign({}, styleBaseline, defaultStyleDefinition);
  return {
    layers: { },
    styles: { default: defaultStyle }
  };
}