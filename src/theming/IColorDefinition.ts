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