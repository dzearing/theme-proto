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

export interface IThemeLayerDefinition extends IThemeModuleDefinitions {
  parent?: string;
  states?: {
    [key: string]: IThemeModuleDefinitions
  }
}

export interface IThemeDefinition extends IThemeLayerDefinition {
  layers?: {
    [key: string]: Partial<IThemeLayerDefinition>;
  }
}

export interface IThemeLayer {
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

export interface ITheme extends IThemeLayer {
  definition: IThemeDefinition,
  layers: {
    [key: string]: ThemeResolver | IThemeLayer;
  }
}

