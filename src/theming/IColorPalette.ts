import { IColor } from "../coloring/color";

export interface ISeedColors {
  fg: IColor;
  bg: IColor;
  accent: IColor;
}

export interface ILayerSets {
  /**
   * Background color layers.  Generated from the seed colors unless specified
   */
  bg: IColor[];
  /**
   * Accent color layers.  Generated from the accent seed color unless specified directly
   */
  accent: IColor[];
  /**
   * Foreground color layers.  Generated from foreground and cached to save on contrast calculations
   */
  fg: IColor[];
  /**
   * Additional layers.  If an additional swatch array is specified, an additional set of
   * layers will be created to match that can then be referenced by name and index.
   */
  [key: string]: IColor[];
}

/*
    The current set of cached and active layers as well as the seed colors used to calculate values
*/
export interface IColorPalette {
  /**
   * Input color values.  These values are used to calculate generated color arrays
   * as well as providing fallbacks for things such as text
   */
  seeds: ISeedColors;

  /**
   * The set of colors that can be referenced by various controls.
   */
  colors: ILayerSets;
}

