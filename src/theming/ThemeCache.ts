import { IThemeStyle, IThemeStyleDefinition, IStyleColors } from "./IThemeStyle";
import { ITheme, IThemeCache } from "./ITheme";
import { IColorLayerKey } from "./IColorLayerKey";
import { DefaultStyleValues, DefaultStyleFallback } from "./themes/ShadedThemes";
import { resolveColor, resolveKey } from "./ThemeColors";
import { mergeObjects } from "./ThemeRegistry";
import { getColorFromRGBA } from "../coloring/color";
import { IColorPalette } from "./IColorPalette";
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
  const styleDefinition = getMergedParentDefinition(theme, styleName);
  styleCache[styleName] = buildStyle(theme.palette, styleDefinition, getThemeStyle(theme));
  return styleCache[styleName];
}

function getMergedParentDefinition(theme: ITheme, styleName?: string): Partial<IThemeStyleDefinition> {
  if (!styleName || styleName === defName || !theme.styles.hasOwnProperty(styleName)) {
    return theme.styles.default;
  }
  const thisStyleDef = theme.styles[styleName];
  return mergeObjects(getMergedParentDefinition(theme, thisStyleDef.parent), thisStyleDef);
}

const fallbackBg = getColorFromRGBA({r: 255, g: 255, b: 255, a: 100});
const fallbackFg = getColorFromRGBA({r: 0, g: 0, b: 0, a: 100});
const bgName = 'bg';

function buildColors(
  palette: IColorPalette, 
  colorDefs: { [key: string]: IColorLayerKey }, 
  colorVals: Partial<IStyleColors>, 
  baseline?: IColorLayerKey
) {
  // do bg first as colors like fg will need it
  let bgKey = baseline;
  if (colorDefs.hasOwnProperty(bgName)) {
    bgKey = resolveKey(colorDefs[bgName], baseline);
    colorDefs[bgName] = bgKey;
    colorVals[bgName] = resolveColor(palette, bgKey, undefined);
  }
  for (const key in colorDefs) {
    if (key !== bgName && colorDefs.hasOwnProperty(key)) {
      colorDefs[key] = resolveKey(colorDefs[key], baseline);
      colorVals[key] = resolveColor(palette, colorDefs[key], bgKey);
    }
  }
}

function buildStyle(palette: IColorPalette, def: IThemeStyleDefinition, parent?: IThemeStyle): IThemeStyle {
  const newDef: IThemeStyleDefinition = parent ? mergeObjects(parent.definition, def) : Object.assign({}, def);
  const newValues = Object.assign({}, DefaultStyleValues, newDef.values);

  // build up the new colors
  const newColors: IStyleColors = { bg: fallbackBg, fg: fallbackFg };
  const colors = { ...newDef.colors };
  newDef.colors = colors;
  const parentColors = parent ? parent.definition.colors : undefined;
  const parentBg = parentColors ? parentColors[bgName] : undefined;
  if (colors) {
    buildColors(palette, colors, newColors, parentBg);
  }

  // now build up the states
  const newStates = { };
  const baseColor = newDef.colors ? newDef.colors.bg : undefined;
  if (newDef.states) {
    const states = newDef.states;
    for (const key in states) {
      if (states.hasOwnProperty(key)) {
        const state = states[key];
        newStates[key] = { };
        if (state.values) {
          newStates[key].values = state.values;
        }
        if (state.colors) {
          newStates[key].colors = { };
          buildColors(palette, state.colors, newStates[key].colors, baseColor);
        }
      }
    }
  }

  // return the built up style
  return { definition: newDef, colors: newColors, values: newValues, states: newStates };
}

/**
 * Create the style cache when creating a new theme.  This will pull what it can from
 * settings.
 * @param palette color palette to build the set of colors in the default style
 * @param settings theme settings to use to initialize the cache
 */
export function createThemeCache(palette: IColorPalette, settings: Partial<IThemeSettings>): IThemeCache {
  const defaultStyleDefinition = settings.styles ? settings.styles.default : DefaultStyleFallback;
  const defaultStyle = buildStyle(palette, defaultStyleDefinition);
  return {
    styles: { default: defaultStyle }
  };
}
