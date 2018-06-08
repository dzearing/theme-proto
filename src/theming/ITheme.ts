import { IColorPalette } from "./IColorPalette";
import { IColorLayer } from "./IColorLayer";
import { IColorDefinitions } from "./IColorDefinition";
import { IThemeStyle } from "./IThemeStyle";

/*
  Overall a theme has:
    colors - core color values referenced by the layers
    settings/constants - properties for various layers
    rules - how to generate colors/layers
*/

export interface ILayerCache {
  [key: string]: IColorLayer
}

/*
  Theme definition, used to specify or modify the theme
*/
export interface IThemeSettings {
  seeds: Partial<IColorDefinitions>;
  styles: {
    default: Partial<IThemeStyle>;
    [key: string]: Partial<IThemeStyle>;
  }
}

/*
  Theme definition, used to create a custom theme or theme variation
*/
export interface IThemeDefinition {
  parent?: string;
  settings: Partial<IThemeSettings>;
}

export interface IThemeCache {
  layers: ILayerCache;
  styles: {
    default: IThemeStyle;
    [key: string]: IThemeStyle;
  }
}

/*
  Full theme, contains both the inputs and calculated/generated values
*/
export interface ITheme extends IThemeSettings {
  colors: IColorPalette;
  cache: IThemeCache;
}
