import { IThemeStyleDefinition } from "./IThemeStyle";

/**
 * Theme colors, used to seed the theming system
 */
export interface IThemeColors {
  /**
   * Foreground is typically the text color
   */
  fg: string;
  /**
   * Default background color, typically a neutral color, this will be used to calculate the set
   * of layered background colors
   */
  bg: string;
  /**
   * Accent color for the theme.  Typically a brighter color, this is used to calculate the
   * themed or accented layers.
   */
  accent: string;
  /**
   * If true the background color is used for tone but the background starts as white (or black
   * if inverted), because white/black loses color this allows for shading to have a non-pure gray
   * cast to it
   */
  useBgForTone: boolean;
  /**
   * Make this theme inverted.  This will cause colors to start dark and get lighter
   */
  invert: boolean;
}

/**
 * Color inputs to the theming system.  This can include only seed colors or also include
 * a fully specified set of colors.
 */
export interface IColorDefinitions extends IThemeColors {
  /**
   * Optional swatch sets, will be generated if not present.
   */
  swatches?: {
    [key: string]: string[];
  }
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
