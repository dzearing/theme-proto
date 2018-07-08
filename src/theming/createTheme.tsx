import {
  ITheme,
  IScheme,
  ISchemes,
  ISwatches,
  IPartialSchemes,
  IPartialScheme
} from "./ITheme";
import { LightTheme } from "./themes/LightTheme";
import { IFontType } from "./ITypography";
import * as deepAssign from "deep-assign";
import { resolve } from "url";

export function createTheme(
  theme?: Partial<ITheme>,
  parentTheme?: ITheme
): ITheme {
  const processedTheme: ITheme = deepAssign(
    {},
    parentTheme || LightTheme,
    theme!
  );

  // Expand font types!
  const { types } = processedTheme.typography;

  // tslint:disable-next-line:forin
  for (const typeName in types) {
    const type: IFontType = types[typeName];
    const { swatches, typography } = processedTheme;

    type.color = swatches[type.color] || type.color || types.default.color;
    type.fontFamily =
      typography.families[type.fontFamily] ||
      type.fontFamily ||
      types.default.fontFamily;
    type.fontSize =
      typography.sizes[type.fontSize] ||
      type.fontSize ||
      types.default.fontSize;
    type.fontWeight =
      typography.weights[type.fontWeight] ||
      type.fontWeight ||
      types.default.fontWeight;
  }

  // Expand schemes
  _expandAllExtends(processedTheme.schemes);
  expandAliases(processedTheme.schemes, processedTheme.swatches);

  return processedTheme;
}

function _expandAllExtends(
  parent: { [key: string]: any },
  visited: { [key: string]: boolean } = {}
): void {
  for (const name in parent) {
    if (parent.hasOwnProperty(name)) {
      _expandChild(parent, name, visited);
    }
  }
}

function _expandChild(
  parent: { extends?: string },
  childName: string,
  visited: { [key: string]: boolean }
) {
  let child: { extends?: string } = parent[childName];
  const extendsName = child.extends;

  if (extendsName) {
    delete child.extends;

    if (!visited[extendsName]) {
      _expandChild(parent, extendsName, visited);
    }

    child = {
      ...parent[extendsName],
      ...child
    };
  }
}

function expandAliases(target: any, source: any): void {
  for (const name in target) {
    if (target.hasOwnProperty(name)) {
      const value = target[name];

      if (typeof value === "string") {
        target[name] = source[value] || value;
      } else if (typeof value === "object") {
        expandAliases(value, source);
      }
    }
  }
}

export default createTheme;
