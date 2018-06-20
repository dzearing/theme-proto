import { IColor } from "../../coloring/color";

/**
 * interface defining how an array of colors should be generated.  This either happens
 * via shading a single seed color or by specifying a full array of colors to use
 */
export interface ISeedColorParams {
  /**
   * Either a single color, or an array of color strings.  If it is a single
   * color that color is used to generate a swatch array using the specified color
   * as the tone of that color
   */
  color: string | string[];
  /**
   * Value between 0 to 100 for inverting the colors.  For an array of tones they will go
   * from lightest (100 luminance) to darkest (0 luminance).  An inverted array will go
   * in reverse order.  The check will be if color.l < invertAt then reverse.  So if 50
   * is the crossover, if the luminance is < 50 (so darker) then invert.
   */
  invertAt?: number;
  /**
   * If a seed color is an intermediate value (not dark or light) it will be in the middle
   * of the range of tones.  If anchroColor is specified the array will be rotated to place
   * the specified color into index 0
   */
  anchorColor?: boolean;
}

/** 
 * Theme colors, used to seed the theming system
 */
export interface ISeedColorDefinitions {
  /**
   * Foreground is typically the text color
   */
  fg: ISeedColorParams;
  /**
   * Default background color, typically a neutral color, this will be used to calculate the set
   * of layered background colors
   */
  bg: ISeedColorParams;
  /**
   * Accent color for the theme.  Typically a brighter color, this is used to calculate the
   * themed or accented layers.
   */
  accent: ISeedColorParams;
  /**
   * Additional color parameters can be appended to the set of definitions.  This will be
   * propogated through the system.
   */
  [key: string]: ISeedColorParams;
}

/**
 * Resolved color arrays
 */
export interface ISeedColors {
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

export const DefaultSeedColors: ISeedColorDefinitions = {
  fg: { color: 'black' },
  bg: { color: '#f3f2f1' },
  accent: { color: '#0078d4', anchorColor: true }
}