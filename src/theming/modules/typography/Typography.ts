import { DefaultTypography } from "./DefaultTypography";
import { registerThemePlugIn } from "../ThemePlugin";

export function registerTypographyModule() {
  registerThemePlugIn({
    name: 'typography',
    default: DefaultTypography,
    resolveValue: resolveTypographyValue
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
