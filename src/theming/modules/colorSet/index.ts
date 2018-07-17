import { IPalettes, IPaletteParams } from "../palettes";
import { IColor } from "../../../coloring/color";
export { registerColorSetModule } from "./ColorResolution";

export type IColorReference = string | IPaletteReference | IColorFunction;

export interface IColorSetDefinitions {
  color: IColorReference;
  backgroundColor: IColorReference;
  [key: string]: IColorReference;
}

export interface IResolvedColor {
  val: IColor;
  key?: IPaletteReference;
  fn?: IColorFunction;
}

export interface IColorSet {
  color: IResolvedColor;
  backgroundColor: IResolvedColor;
  [key: string]: IResolvedColor;
}

/*
  Key for indexing and referring to colors and layers.
  type: should be one of:
    bg|accent|fg  - index into the layers for backgrounds, themed colors, and fg colors
    switch        - given a base key, switch from bg to accent or vice versa
    rel           - given a base key, adjust the shade value by the amount specified
    relswitch     - combine switch and rel functionality
    fn            - use a function to calculate the value.  In this case name is the function
                    name and shade is an optional parameter
  shade: which color shade numerically is being referenced
  name: specified for custom layers, if valid it is assumed to be custom
*/
export interface IPaletteReference {
  palette: string;
  shade: number;
}

/**
 * specify a color as a color function or transform, generally relative to the background
 */
export interface IColorFunction {
  fn: keyof IColorTransforms;
  p1?: number | string;
  p2?: number | string;
  textStyle?: keyof ITextColorStyles;
}

export type ColorFunction = (input: IColorFunction, palettes: IPalettes, bg: IResolvedColor) => IResolvedColor

export interface IColorTransforms {
  autoText: ColorFunction;
  deepen: ColorFunction;
  swap: ColorFunction;
}

export interface ITextColorStyles {
  default: ITextColorStyleSettings;
  soft: ITextColorStyleSettings;
  light: ITextColorStyleSettings;
  success: ITextColorStyleSettings;
  error: ITextColorStyleSettings;
}

export interface ITextColorStyleSettings {
  palette: string;
  paletteConfig: IPaletteParams;
  lightOffset?: number;
  darkOffset?: number;
  keepTone?: boolean;
}

export interface IColorSetParams {
  textColor?: keyof ITextColorStyles;
}