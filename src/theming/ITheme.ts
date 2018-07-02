import { ISeedColorDefinitions, ISeedColors } from "./modules/seedColors";
import { IColorSetDefinitions, IColorSet } from "./modules/colorSet";
import { ITypography } from "./modules/typography/ITypography";
import { IRawStyle } from "@uifabric/styling";

export interface IThemeModuleDefinitions {
  props?: IRawStyle;
  seedColors?: Partial<ISeedColorDefinitions>;
  colorSet?: Partial<IColorSetDefinitions>;
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

