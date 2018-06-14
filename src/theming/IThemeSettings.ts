import { IThemeStyleDefinition } from "./IThemeStyle";

export interface IColorParams {
  /**
   * Either a single color, or an array of color strings.  If it is a single
   * color that color is used to generate a swatch array using the specified color
   * as the tone of that color
   */
  color: string|string[];
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
export interface IColorDefinitions {
  /**
   * Foreground is typically the text color
   */
  fg: IColorParams;
  /**
   * Default background color, typically a neutral color, this will be used to calculate the set
   * of layered background colors
   */
  bg: IColorParams;
  /**
   * Accent color for the theme.  Typically a brighter color, this is used to calculate the
   * themed or accented layers.
   */
  accent: IColorParams;
  /**
   * Additional color parameters can be appended to the set of definitions.  This will be
   * propogated through the system.
   */
  [key: string]: IColorParams;
}

/**
 * The theme settings are the set of partial inputs that define a theme.  They act as
 * overrides for the behaviors that were present before.
 */
export interface IThemeSettings {
  /**
   * specifies the color mapping to use for the theme.  In the layered scenario, if this
   * is not specified then the color palette will not be rebuilt.  If it is specified then
   * the theme will create a new color palette.
   */
  seeds?: Partial<IColorDefinitions>;
  /**
   * the set of styles for the theme.  Note that entries for each key value will replace rather
   * than merge with the values for the previous theme
   */
  styles: {
    default: Partial<IThemeStyleDefinition>;
    [key: string]: Partial<IThemeStyleDefinition>;
  }
}

/**
 * Theme definitions are used to create a theme based upon an existing theme.  If no parent is
 * specified this will be based upon the default theme.
 */
export interface IThemeDefinition {
  /**
   * name of the parent theme.  Cascading theme settings are not resolved until the theme is
   * actually created.
   */
  parent?: string;
  /**
   * settings for this theme
   */
  settings: IThemeSettings;
}
