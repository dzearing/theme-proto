import { IColorLayerKey } from "./IColorLayerKey";
import { IRawStyle } from "@uifabric/styling";

/**
 * The set of possible settings that can be specified for a given type of control or
 * globally.  Note that if no value is specified it will fallback to default values.
 */
export interface IThemeStyle {
  /**
   * Background layer to use for this type of control
   */
  key: IColorLayerKey;
  /**
   * Parent style.  If unspecified this style will parent to the default style
   */
  parent?: string;
  /**
   * Fonts for various sizes
   */
  fonts: IFonts;
  /**
   * Font weights
   */
  fontWeights: IFontWeights;
  /**
   * Border thickness
   */
  borderThickness?: number;
}

export interface IFonts {
  medium: IRawStyle;
}

export interface IFontWeights {
  emphasized: IRawStyle;
  normal: IRawStyle;
  diminished: IRawStyle;
}