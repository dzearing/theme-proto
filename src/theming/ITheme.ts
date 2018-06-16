import { ILayerSets } from "./IColorPalette";
import { IThemeStyle } from "./IThemeStyle";
import { IThemeSettings } from "./IThemeSettings";

/*
  Overall a theme has:
    colors - core color values referenced by the layers
    settings/constants - properties for various layers
    rules - how to generate colors/layers
*/

export interface IThemeCache {
  styles: {
    default: IThemeStyle;
    [key: string]: IThemeStyle;
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

/*
  Full theme, contains both the inputs and calculated/generated values
*/
export interface ITheme extends IThemeSettings {
  palette: ILayerSets;
  cache: IThemeCache;
}