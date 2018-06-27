import { IThemeRequest } from "../modules/IThemeModule";
import { resolveValues } from "../modules/ThemeModule";
import { getThemeStyleCore } from "./ThemeCreation";
import { IBaseTheme, IBaseStyle } from "./baseStructure";

/**
 * Extract (while potentially transforming) a number of props from the theme and turn them into a
 * form suitable for returning
 * @param theme theme to extract and flatten props from
 * @param request request for properties this object cares about
 * @param styleName name of the style to use.  If undefined the default style will be used
 */
export function fillThemePropsCore(theme: IBaseTheme, request: IThemeRequest, styleName?: string): any {
  const style = getThemeStyleCore(theme, styleName);
  return fillThemePropsWorker(style, request, true);
}

function fillThemePropsWorker(style: IBaseStyle, request: IThemeRequest, recurse: boolean): any {
  const result = {};
  for (const key in request) {
    if (request.hasOwnProperty(key)) {
      if (key === 'states') {
        if (recurse && style.hasOwnProperty(key)) {
          const stateRequest = request[key];
          const styleStates = style[key];
          if (styleStates) {
            const stateResults = {};
            for (const state in stateRequest) {
              if (stateRequest.hasOwnProperty(state)) {
                const entry = stateRequest[state];
                const styleKey = typeof entry === 'string' ? entry : entry.value;
                stateResults[state] = fillThemePropsWorker(styleStates[styleKey], request, false);
              }
            }
            Object.assign(result, { selectors: stateResults });
          }
        }
      } else if (style.hasOwnProperty(key) && style[key]) {
        Object.assign(result, resolveValues(key, style[key], request[key]));
      }
    }
  }
  return result;
}