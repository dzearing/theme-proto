import { ITheme } from "./ITheme";
import { constructNamedColor } from "./Transforms";
import { getThemeLayer } from "./ThemeCache";

/*
  Input/output type.  On input it is a collection of:
    [destination key]: color name
  
  On output the returned value is:
    [destination key]: resolved color value
*/
export interface IThemeRequest {
  [key: string]: string;
}

/**
 * Query a set of colors from the theme and put them into the specified values.  Set up
 * such that it can be used easily in a spread operator
 * @param theme Theme to extract colors from
 * @param requestedColors A set of colors to obtain.  Key is used for the destination, 
 * string for each key is the lookup value
 * @param layerName Name of the style the requested colors correspond to.  
 * If blank or not found it will use default.
 * @param layerState Optional state override value to get a variation for that style.
 */
export function fillThemeColors(
  theme: ITheme, 
  requestedColors: IThemeRequest, 
  layerName?: string, 
  layerState?: string
): IThemeRequest {
  const layer = getThemeLayer(theme, layerName);
  const result: IThemeRequest = { };

  for (const key in requestedColors) {
    if (requestedColors.hasOwnProperty(key)) {
      const clr = layer.clr;
      const colorName = requestedColors[key];
      if (!clr.hasOwnProperty(colorName)) {
        clr[colorName] = constructNamedColor(colorName, layer, theme);
      }
      result[key] = clr[colorName].str;
    }
  }

  return result;
}
