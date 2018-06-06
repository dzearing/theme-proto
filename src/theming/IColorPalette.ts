import { IColor } from "../coloring/color";
import { IColorLayer } from "./IColorLayer";

export interface ISeedColors {
  fg: IColor;
  bg: IColor;
  accent: IColor;
}

export interface ILayerSets {
  /**
   * Background color layers.  Generated from the seed colors unless specified
   */
  bg: IColorLayer[];
  /**
   * Accent color layers.  Generated from the accent seed color unless specified directly
   */
  accent: IColorLayer[];
  /**
   * Additional layers.  If an additional swatch array is specified, an additional set of
   * layers will be created to match that can then be referenced by name and index.
   */
  [key: string]: IColorLayer[];
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
   * The set of layers that can be referenced by various controls.
   */
  layers: ILayerSets;
}

