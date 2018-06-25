import { IThemeRequest } from "../plugins/IThemePlugin";
import { resolveValues } from "../plugins/ThemePlugin";
import { getThemeStyleCore } from "./ThemeCreation";

/**
 * Extract (while potentially transforming) a number of props from the theme and turn them into a
 * form suitable for returning
 * @param theme theme to extract and flatten props from
 * @param request request for properties this object cares about
 * @param styleName name of the style to use.  If undefined the default style will be used
 */
export function fillThemePropsCore(theme: object, request: IThemeRequest, styleName?: string): any {
  const style = getThemeStyleCore(theme, styleName);
  return fillThemePropsWorker(style, request, true);
}

function fillThemePropsWorker(style: object, request: IThemeRequest, recurse: boolean): any {
  const result = {};
  for (const key in request) {
    if (request.hasOwnProperty(key)) {
      if (key === 'states') {
        if (recurse && style.hasOwnProperty(key)) {
          const styleStates = style[key];
          const stateResults = {};
          for (const state in styleStates) {
            if (styleStates.hasOwnProperty(state)) {
              stateResults[state] = fillThemePropsWorker(styleStates[state], request, false);
            }
          }
          Object.assign(result, { selectors: stateResults });
        }
      } else if (style.hasOwnProperty(key)) {
        Object.assign(result, resolveValues(key, style[key], request[key]));
      }
    }
  }
}