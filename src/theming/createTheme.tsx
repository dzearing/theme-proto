import { ITheme } from "./ITheme";
import { LightTheme } from "./themes/LightTheme";
import { IFontType } from "./ITypography";
import * as deepAssign from "deep-assign";

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
  // tslint:disable-next-line:forin
  for (const setName in processedTheme.schemes) {
    const set = processedTheme.schemes[setName];

    // tslint:disable-next-line:forin
    for (const setPropName in set) {
      const propValue = set[setPropName];

      set[setPropName] = processedTheme.swatches[propValue] || propValue;
    }
  }

  return processedTheme;
}

export default createTheme;

// const processedTheme = {
//     paletteSets: {} as { [key: string]: IPaletteSet },
//     typeography: theme.typography,
//     fontWeights: theme.fontWeights || {}
//   };

//   for (const setName in theme.paletteSets) {
//     if (theme.paletteSets.hasOwnProperty(setName)) {
//       const set = theme.paletteSets[setName];
//       const targetSet = processedTheme.paletteSets[setName] = {} as any;

//       for (const setPropName in set) {
//         if (set.hasOwnProperty(setPropName)) {
//           targetSet[setPropName] = theme.swatches[set[setPropName]] || set[setPropName];
//         }
//       }
//     }
//   }

//   return processedTheme as ITheme;
// }
