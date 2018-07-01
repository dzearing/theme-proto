import { DefaultTypography } from "./DefaultTypography";
import { registerThemeModule } from "../../modules/ThemeModule";
import { IRawStyle } from "@uifabric/styling";
import { ITypography, ITypographyProps } from "./ITypography";

export function registerTypographyModule() {
  registerThemeModule({
    name: 'typography',
    default: DefaultTypography,
    resolveValue: resolveTypographyValue,
    updateStyle: addTypographyToStyle
  })
}

const defaultKey = 'default';

function resolveTypographyValue(value: any, modifier?: string): any {
  if (typeof value === 'object') {
    if (modifier && value.hasOwnProperty(modifier)) {
      return value[modifier];
    }
    if (value.hasOwnProperty(defaultKey)) {
      return value[defaultKey];
    }
  }
  return value;
}

function addTypographyToStyle(style: IRawStyle, typography: ITypography, props?: ITypographyProps): IRawStyle {
  const defaultProps: ITypographyProps = { family: 'default', weight: 'default', size: 'medium' };
  props = Object.assign({}, defaultProps, props);
  if (props.type) {
    const fontType = typography.types[props.type];
    style.fontFamily = fontType.fontFamily;
    style.fontWeight = fontType.fontWeight as any;
    style.fontSize = fontType.fontSize;
  } else {
    style.fontFamily = typography.families[props.family!];
    style.fontWeight = typography.weights[props.weight!] as any;
    style.fontSize = typography.sizes[props.size!];
  }
  return style;
}