import { IColorLayer } from "./IColorLayer";
import { ITheme } from "./ITheme";
import { IColor } from "../coloring/color";
import { IColorLayerKey } from "./IColorLayerKey";

/*
  Named color generation function props.  Should return an IColor
*/
export interface IGenerateNamedColorProps {
  name: string;       // provided so a single function can potentially handle multiple inputs
  layer: IColorLayer; // current layer where this color is being produced
  theme: ITheme;      // current theme for additional context if needed
}

/*
  Layer generation function props.  Should return an IColorLayer.  This may refer
  to an existing layer in the theme or may be a new layer
*/
export interface IGenerateNamedLayerProps {
  name: string;             // name of the layer, to allow multiplexing inputs
  baseKey: IColorLayerKey;  // key for the base layer
  baseLayer: IColorLayer;   // base layer or default layer
  theme: ITheme;            // current theme for context if needed
}

/*
  defaults for various types of controls
*/
export interface IDefaultLayers {
  base: IColorLayerKey;     // default layer for flat controls
  shaded: IColorLayerKey;   // default layer for shaded controls such as buttons
  themed: IColorLayerKey;   // default layer for themed controls such as default button
}

/*
  transforms parameters for standard functions
*/
export interface ITransformParameters {
  hoverDelta: number;
  pressedDelta: number;
  selectedKey: IColorLayerKey;
}

/*
  Factory for colors and layers, generally global
*/
export interface IThemeFactory {
  // factories for generating colors and layers
  makeColor: { [key: string]: (props: IGenerateNamedColorProps) => IColor};
  makeLayer: { [key: string]: (props: IGenerateNamedLayerProps) => IColorLayer};
}

/*
  Package of values that can be loaded by name
*/
export interface IThemePackage {
  fg: IColor;
  bg: IColor;
  accent: IColor;
  defaultLayer: IDefaultLayers;
  transformParams: ITransformParameters;
  factory: IThemeFactory;

}