import { ITheme } from "./ITheme";
import { getThemeStyle } from "./ThemeCache";
import { IThemeRequest } from "./IThemeStyle";

/*
  Input/output type.  On input it is a collection of:
    [destination key]: color name
  
  On output the returned value is:
    [destination key]: resolved color value
*/

function mapRequests(result: object, requested: {[key: string]: string}, lookup: object, mapfn: (val: any) => any) {
  for (const key in requested) {
    if (requested.hasOwnProperty(key) && lookup.hasOwnProperty(requested[key])) {
      result[key] = mapfn(lookup[requested[key]]);
    }
  }
}

const colorKey = 'colors';
const valueKey = 'values';

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
export function fillThemeProps(
  theme: ITheme, 
  request: IThemeRequest, 
  styleName?: string
) {
  const { colors, values, states } = request;
  const style = getThemeStyle(theme, styleName);
  const result = { };

  if (colors) {
    mapRequests(result, colors, style.colors, (color) => ( color.str ));
  }

  if (values) {
    mapRequests(result, values, style.values, (val) => ( val ));
  }

  if (states) {
    const stateParent = 'selectors';
    const selectors = { };
    result[stateParent] = selectors;
    mapRequests(selectors, states, style.states, (selectorStyle) => {
      const newSelector = { };
      if (colors && selectorStyle.hasOwnProperty(colorKey)) {
        mapRequests(newSelector, colors, selectorStyle[colorKey], (color) => (color.str));
      }
      if (values && selectorStyle.hasOwnProperty(valueKey)) {
        mapRequests(newSelector, values, selectorStyle[valueKey], (val) => (val));
      }
      return newSelector;
    })
  }

  return result;
}
