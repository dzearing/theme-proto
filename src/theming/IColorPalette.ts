import { IColor } from "../coloring/color";
import { IColorLayer } from "./IColorLayer";
import { getShade, getBackgroundShade, getContrastRatio } from "../coloring/shading";
import { IColorLayerKey, resolveKey, isIndexKey } from "./IColorLayerKey";
import { ITheme, ILayerCache } from "./ITheme";
import { constructNamedColor } from "./Transforms";

export interface ISeedColors {
  fg: IColor;
  bg: IColor;
  accent: IColor;
}

/*
    The current set of cached and active layers as well as the seed colors used to calculate values
*/
export interface IColorPalette {
  // input color values
  seed: ISeedColors;
  
  // calculated base colors
  bg: IColor[];
  accent: IColor[];

  // layer caches
  layers: {
    bg: IColorLayer[];
    accent: IColorLayer[];
  }
}

// count of layers, this should be dynamic but currently matches what is in shades.ts
export const PALETTE_LAYER_COUNT: number = 9;
const defaultName: string = 'default';

export function createColorPalette(seed: ISeedColors): IColorPalette {
  return {
    seed,
    bg: createBgColorArray(seed.bg),
    accent: createThemeColorArray(seed.accent),
    layers: {
      bg: new Array<IColorLayer>(PALETTE_LAYER_COUNT),
      accent: new Array<IColorLayer>(PALETTE_LAYER_COUNT),
    }
  };
}

function createThemeColorArray(theme: IColor): IColor[] {
  const results: IColor[] = new Array<IColor>(PALETTE_LAYER_COUNT);
  for (let i: number = 0; i < PALETTE_LAYER_COUNT; i++) {
    results[i] = getShade(theme, i, false);
  }
  return results;
}

function createBgColorArray(bg: IColor): IColor[] {
  const results: IColor[] = new Array<IColor>(PALETTE_LAYER_COUNT);
  for (let i: number = 0; i < PALETTE_LAYER_COUNT; i++) {
    results[i] = getBackgroundShade(bg, i, false);
  }
  return results;
}

function createLayerForBackground(key: IColorLayerKey, newBg: IColor, palette: IColorPalette): IColorLayer {
  const seed = palette.seed;
  const bgRatio: number = getContrastRatio(newBg, seed.bg);
  const fgRatio: number = getContrastRatio(newBg, seed.fg);
  const fg = fgRatio > bgRatio ? seed.fg : seed.bg;
  return {key, clr: { fg, bg: newBg }} as IColorLayer;
}

function getCustomLayer(name: string, theme: ITheme): IColorLayer {
  const layers = theme.layers;
  if (!layers.hasOwnProperty(name)) {
    const offsets = theme.offsets;
    if (offsets.hasOwnProperty(name)) {
      layers[name] = getLayer(offsets[name], theme);
    } else if (name !== defaultName) {
      return getCustomLayer(defaultName, theme);
    }
  }
  return layers[name];
}

export function getLayer(key: IColorLayerKey, theme: ITheme): IColorLayer {
  if (key.name) {
    return getCustomLayer(key.name, theme);
  } else if (isIndexKey(key)) {
    const { type, shade } = key;
    const colors = theme.colors;
    const layers = colors.layers[key.type];
    const colorVals = colors[key.type];

    if (shade >= colorVals.length) {
      key = { ...key, shade: (shade % colorVals.length)};
    }
    if (!layers[shade]) {
      layers[shade] = createLayerForBackground({type, shade}, colorVals[key.shade], colors);
    }
    return layers[shade];
  }
  // absolute fallback right now is to just return the default layer
  return getCustomLayer(defaultName, theme);
}

export function getLayerFromKeys(key: IColorLayerKey, baseline: IColorLayerKey, theme: ITheme): IColorLayer {
  key = resolveKey(key, baseline);
  return getLayer(key, theme);
}

/*
  Input/output type.  On input it is a collection of:
    [destination key]: color name
  
  On output the returned value is:
    [destination key]: resolved color value
*/
export interface IColorRequest {
  [value: string]: string;
}

export function getThemeColors(layerName: string, theme: ITheme, requested: IColorRequest) : IColorRequest {
  const layers: ILayerCache = theme.layers;
  let layer: IColorLayer;
  if (!layers.hasOwnProperty(layerName)) {
    const offsets = theme.offsets;
    if (offsets.hasOwnProperty(layerName)) {
      const layerKey: IColorLayerKey = offsets[layerName];
      layer = getLayerFromKeys(layerKey, offsets.default, theme);
      layers[layerName] = layer;
    } else {
      return getThemeColors(defaultName, theme, requested);
    }
  } else {
    layer = layers[layerName];
  }

  const colors = { ...requested };
  for (const key in requested) {
    if (requested.hasOwnProperty(key)) {
      const clr = layer.clr;
      const colorName = requested[key];
      if (!clr.hasOwnProperty(colorName)) {
        clr[colorName] = constructNamedColor(colorName, layer, theme);
      }
      colors[key] = clr[colorName].str;
    }
  }

  return colors;
}