import { ISeedColorDefinitions, ISeedColors } from "./modules/seedColors";
import { IColorSetDefinitions, IColorSet } from "./modules/colorSet";
import { ITypography } from "./modules/typography/ITypography";
import { IRawStyle } from "@uifabric/styling";
import { ThemeResolver } from "./core/ICoreTypes";

export interface IThemeModuleDefinitions {
  settings?: IRawStyle;
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
  parent?: string,
  settings: IRawStyle,
  seedColors: ISeedColors,
  colors: IColorSet,
  typography: ITypography,
  states: {
    [key: string]: {
      settings?: IRawStyle,
      seedColors?: Partial<ISeedColors>,
      colors?: Partial<IColorSet>,
      typography?: Partial<ITypography>,
    }
  }
}

export interface ITheme extends IThemeStyle {
  definition: IThemeDefinition,
  styles: {
    [key: string]: ThemeResolver | IThemeStyle;
  }
}

