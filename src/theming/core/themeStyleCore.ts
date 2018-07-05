import { adjustStyleProps } from "../core/ThemeModule";
import { getThemeStyleCore } from "./ThemeCreation";
import { IBaseTheme, IStyleRequestProps, IBaseStyle } from "./ICoreTypes";

export function themeStyleCore<ITheme extends IBaseTheme>(theme: ITheme, props?: string | IStyleRequestProps): object {
  let styleName: string | undefined;
  let modules;
  if (props) {
    if (typeof props === 'string') {
      styleName = props;
    } else {
      styleName = props.name;
      modules = props.modules;
    }
  }
  const style = getThemeStyleCore<ITheme, IBaseStyle>(theme, styleName);
  let rawStyle = style.props || {};
  if (modules) {
    rawStyle = adjustStyleProps(style, rawStyle, modules, modules);
  }
  return rawStyle;
}