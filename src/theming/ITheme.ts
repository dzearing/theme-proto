import { ISeedColorDefinitions, ISeedColors } from "./modules/seedColors/ISeedColors";
import { IColorSetDefinitions, IColorSet } from "./modules/colorSets/IColorSet";
import { ITypography } from "./modules/typography/ITypography";
import { IStyleValues } from "./modules/styleProps/IStyleProps";

export interface IThemeModuleDefinitions {
  seedColors?: Partial<ISeedColorDefinitions>,
  colors?: Partial<IColorSetDefinitions>,
  typography?: Partial<ITypography>,
  values?: Partial<IStyleValues>
}

export interface IThemeStyleDefinition extends IThemeModuleDefinitions {
  parent?: string;
  states?: {
    [key: string]: IThemeModuleDefinitions
  }
}

export interface IThemeDefinition extends IThemeStyleDefinition {
  styles?: {
    [key: string]: Partial<IThemeStyleDefinition>;
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

