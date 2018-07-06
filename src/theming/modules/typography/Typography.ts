import { DefaultTypography } from "./DefaultTypography";
import { registerThemeModule } from "../../core/ThemeModule";
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
  const typeProps = props && props.type && typography.types.hasOwnProperty(props.type) ? typography.types[props.type] : undefined;
  // resolve type properties first
  let {
    fontFamily = defaultKey,
    fontSize = 'medium',
    fontWeight = defaultKey
  } = typeProps || {};

  // override with specific props that were set
  if (props) {
    fontFamily = props.family || fontFamily;
    fontSize = props.size || fontSize;
    fontWeight = props.weight || fontWeight;
  }

  // now set the values
  style.fontFamily = typography.families[fontFamily];
  style.fontWeight = typography.weights[fontWeight] as any;
  style.fontSize = typography.sizes[fontSize];
  return style;
}