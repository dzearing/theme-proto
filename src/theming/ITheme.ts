import { ISeedColorDefinitions, ISeedColors } from "./modules/seedColors/ISeedColors";
import { IColorSetDefinitions, IColorSet } from "./modules/colorSets/IColorSet";
import { ITypography } from "./modules/typography/ITypography";
import { IRawStyle } from "@uifabric/styling";

export interface IThemeModuleDefinitions {
  props?: IRawStyle;
  seedColors?: Partial<ISeedColorDefinitions>;
  colors?: Partial<IColorSetDefinitions>;
  typography?: Partial<ITypography>;
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
  props: IRawStyle,
  seedColors: ISeedColors,
  colors: IColorSet,
  typography: ITypography,
  states: {
    props: IRawStyle,
    seedColors?: Partial<ISeedColors>,
    colors?: Partial<IColorSet>,
    typography?: Partial<ITypography>,
  }
}

export interface ITheme extends IThemeStyle {
  definition: IThemeDefinition,
  styles: {
    [key: string]: IThemeStyle
  }
}

