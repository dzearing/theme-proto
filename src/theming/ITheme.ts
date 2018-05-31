import { IColorPalette } from "./IColorPalette";
import { IThemeOffsets } from "./IThemeDefinition";
import { IRawStyle } from '@uifabric/styling';
import { IColorLayer } from "./IColorLayer";

/*
  Seed colors, used to calculate the scheme for the theme
*/
export interface IThemeColors {
  fg: string;
  bg: string;
  accent: string;
}

export interface IFonts {
  medium: IRawStyle;
}

export interface IFontWeights {
  emphasized: IRawStyle;
  normal: IRawStyle;
  diminished: IRawStyle;
}

export interface ILayerCache {
  [key: string]: IColorLayer
}

/*
  Theme definition, used to specify or modify the theme
*/
export interface IThemeSettings {
  seedColors: Partial<IThemeColors>;
  offsets: IThemeOffsets;
  fonts: IFonts;
  fontWeights: IFontWeights;
}

/*
  Theme definition, used to create a custom theme or theme variation
*/
export interface IThemeDefinition {
  parent?: string;
  settings: Partial<IThemeSettings>;
}

/*
  Full theme, contains both the inputs and calculated/generated values
*/
export interface ITheme extends IThemeSettings {
  colors: IColorPalette;
  layers: ILayerCache;
}
