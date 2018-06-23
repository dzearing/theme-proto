import { ISeedColorDefinitions, ISeedColors } from "./plugins/seedColors/ISeedColors";
import { IColorSetDefinitions, IColorSet } from "./plugins/colorSets/IColorSet";
import { ITypography } from "./plugins/typography/ITypography";
import { IStyleValues } from "./plugins/styleProps/IStyleProps";


export interface IThemeStyleDefinition {
  seedColors: ISeedColorDefinitions,
  colors: IColorSetDefinitions,
  typography: ITypography,
  values: IStyleValues,
  states: {
    seedColors?: Partial<ISeedColorDefinitions>,
    colors?: Partial<IColorSetDefinitions>,
    typography?: Partial<ITypography>,
    values?: Partial<IStyleValues>
  }
}

export interface IThemeDefinition extends IThemeStyleDefinition {
  styles: {
    [key: string]: Partial<IThemeStyleDefinition>
  }
}

export interface IThemeStyle {
  seedColors: ISeedColors,
  colors: IColorSet,
  typography: ITypography,
  values: IStyleValues,
  states: {
    seedColors?: Partial<ISeedColors>,
    colors?: Partial<IColorSet>,
    typography?: Partial<ITypography>,
    values?: Partial<IStyleValues>
  }
}

export interface ITheme extends IThemeStyle {
  definition: IThemeDefinition,
  styles: {
    [key: string]: IThemeStyle
  }
}