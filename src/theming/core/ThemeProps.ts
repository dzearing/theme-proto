import { adjustStyleProps } from "../modules/ThemeModule";
import { getThemeStyleCore } from "./ThemeCreation";
import { IBaseTheme, IStyleRequestProps } from "./baseStructure";
import { IRawStyle } from "@uifabric/styling";

export function themeStyleCore(theme: IBaseTheme, props?: string | IStyleRequestProps): IRawStyle {
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
  const style = getThemeStyleCore(theme, styleName);
  let rawStyle: IRawStyle = style.props || {};
  if (modules) {
    rawStyle = adjustStyleProps(style, rawStyle, modules);
  }
  return rawStyle;
}