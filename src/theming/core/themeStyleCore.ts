import { adjustSettings } from "./ThemeModule";
import { getThemeLayerCore } from "./ThemeCreation";
import { IBaseTheme, ISettingsRequestProps, IBaseLayer } from "./ICoreTypes";

export function themeSettingsCore<ITheme extends IBaseTheme>(theme: ITheme, parameters?: string | ISettingsRequestProps): object {
  let styleName: string | undefined;
  let modules;
  if (parameters) {
    if (typeof parameters === 'string') {
      styleName = parameters;
    } else {
      styleName = parameters.name;
      modules = parameters.modules;
    }
  }
  const style = getThemeLayerCore<ITheme, IBaseLayer>(theme, styleName);
  let rawStyle = style.settings || {};
  if (modules) {
    rawStyle = adjustSettings(style, rawStyle, modules, modules);
  }
  return rawStyle;
}