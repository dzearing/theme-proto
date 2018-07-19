import { IPaletteDefinitions, IPalettes } from "./modules/palettes";
import { ITypography } from "./modules/typography/ITypography";
import { IRawStyle } from "@uifabric/styling";
import { ThemeResolver } from "./core/ICoreTypes";
import { IColorSetDefinitions, IColorSet } from "./modules/colorSet";

export interface IThemeModuleDefinitions {
  settings?: IRawStyle;
  palettes?: Partial<IPaletteDefinitions>;
  colorSet?: Partial<IColorSetDefinitions>;
  typography?: Partial<ITypography>;
}

export interface IThemeLayerDefinition extends IThemeModuleDefinitions {
  parent?: string | string[];
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
  parent?: string | string[],
  settings: IRawStyle,
  palettes: IPalettes,
  colors: IColorSet,
  typography: ITypography,
  states: {
    [key: string]: {
      settings?: IRawStyle,
      palettes?: Partial<IPalettes>,
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

