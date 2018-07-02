import { DefaultTypography } from "./DefaultTypography";
import { registerThemeModule } from "../../modules/ThemeModule";
import { IRawStyle } from "@uifabric/styling";
import { ITypography, ITypographyProps } from "./ITypography";

export function registerTypographyModule() {
  registerThemeModule({
    name: 'typography',
    default: DefaultTypography,
    updateStyle: addTypographyToStyle
  })
}

const defaultKey = 'default';

function addTypographyToStyle(style: IRawStyle, typography: ITypography, props?: ITypographyProps): IRawStyle {
  const defaultProps: ITypographyProps = { family: defaultKey, weight: defaultKey, size: 'medium' };
  props = Object.assign({}, defaultProps, props);
  if (props.type) {
    const fontType = typography.types[props.type];
    props.family = fontType.fontFamily || props.family as any;
    props.size = fontType.fontSize || props.size as any;
    props.weight = fontType.fontWeight || props.weight as any;
  }
  style.fontFamily = typography.families[props.family!];
  style.fontWeight = typography.weights[props.weight!] as any;
  style.fontSize = typography.sizes[props.size!];
  return style;
}