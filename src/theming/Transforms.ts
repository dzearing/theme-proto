import { IColorLayer } from "./IColorLayer";
import { ITheme } from "./ITheme";
import { IColor } from "../coloring/color";

export interface IColorTransformProps {
  layer: IColorLayer;
  theme: ITheme;
}

const colorTransforms: { [key: string]: (props: IColorTransformProps) => IColor } = {
  stroke: strokeColor,
  halftoneStroke,
}

export function registerTransform(name: string, fn: (props: IColorTransformProps) => IColor) {
  colorTransforms[name] = fn;
}

export function constructNamedColor(name: string, layer: IColorLayer, theme: ITheme): IColor {
  if (colorTransforms.hasOwnProperty(name)) {
    return colorTransforms[name]({layer, theme});
  }
  return layer.clr.fg;
}

function halftoneStroke(props: IColorTransformProps): IColor {
  return relativeColor(props.layer, props.theme, 2);
}

function strokeColor(props: IColorTransformProps): IColor {
  return relativeColor(props.layer, props.theme, 4);
}

function relativeColor(layer: IColorLayer, theme: ITheme, delta: number): IColor {
  const bg = layer.key.type === 'bg';
  const vals = bg ? theme.colors.layers.bg : theme.colors.layers.accent;
  const shade = (layer.key.shade + vals.length + delta) % vals.length;
  return vals[shade].clr.bg;
}