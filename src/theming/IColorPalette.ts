import { IColor } from "../coloring/color";
import { IColorLayer } from "./IColorLayer";
import { getShade, getBackgroundShade, getContrastRatio } from "../coloring/shading";
import { IColorLayerKey, ColorLayerType } from "./IColorLayerKey";
import { ITheme } from "./ITheme";

/*
    The current set of cached and active layers as well as the seed colors used to calculate values
*/
export interface IColorPalette {
  // seed colors
  fg: IColor;
  bg: IColor;
  theme: IColor;

  // calculated base colors
  bgs: IColor[];
  themes: IColor[];

  // layer caches
  bgLayers: IColorLayer[];
  themeLayers: IColorLayer[];

  layers: { [key: string]: IColorLayer };
}

// count of layers, this should be dynamic but currently matches what is in shades.ts
export const PALETTE_LAYER_COUNT: number = 9;

export function createColorPalette(fg: IColor, bg: IColor, theme: IColor): IColorPalette {
  return {
    fg,
    bg,
    theme,
    bgs: createBgColorArray(bg),
    themes: createThemeColorArray(theme),
    bgLayers: new Array<IColorLayer>(PALETTE_LAYER_COUNT),
    themeLayers: new Array<IColorLayer>(PALETTE_LAYER_COUNT),
    layers: {}
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
  const bgRatio: number = getContrastRatio(newBg, palette.bg);
  const fgRatio: number = getContrastRatio(newBg, palette.fg);
  const fg = fgRatio > bgRatio ? palette.fg : palette.bg;
  return {key, clr: { fg, bg: newBg }} as IColorLayer;
}

export function getLayer(bgLayer: boolean, shade: number, palette: IColorPalette): IColorLayer {
  shade = (shade % PALETTE_LAYER_COUNT);
  if (bgLayer) {
    const bgLayers = palette.bgLayers;
    if (!bgLayers[shade]) {
      bgLayers[shade] = createLayerForBackground(palette.bgs[shade], palette);
    }
    return bgLayers[shade];
  } else {
    const themeLayers = palette.themeLayers;
    if (!themeLayers[shade]) {
      themeLayers[shade] = createLayerForBackground(palette.themes[shade], palette);
    }
    return themeLayers[shade];
  }
}

export function getLayerFromKeys(key: IColorLayerKey, baseline: IColorLayerKey, palette: IColorPalette): IColorLayer {
  let bgLayer: boolean = (baseline.type === ColorLayerType.Bg);
  let shade: number = baseline.shade;
  switch (key.type) {
    case ColorLayerType.Bg:
      bgLayer = true;
      shade = key.shade;
      break;
    case ColorLayerType.Accent:
      bgLayer = false;
      shade = key.shade;
      break;
    case ColorLayerType.Relative:
      shade = shade + key.shade;
      break;
    case ColorLayerType.Switch:
      bgLayer = !bgLayer;
      shade = key.shade;
      break;
    case ColorLayerType.SwitchRel:
      bgLayer = !bgLayer;
      shade = shade + key.shade;
  }
  return getLayer(bgLayer, shade, palette);
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
  const palette = theme.colors;
  const layers = palette.layers;
  let layer: IColorLayer;
  if (!layers.hasOwnProperty(layerName)) {
    const offsets = theme.offsets;
    if (offsets.hasOwnProperty(layerName)) {
      const layerKey: IColorLayerKey = offsets[layerName];
      layer = getLayerFromKeys(layerKey, layerKey, palette);
      layers[layerName] = layer;
    } else {
      return getThemeColors('default', theme, requested);
    }
  } else {
    layer = layers[layerName];
  }

  const colors = { ...requested };
  for (const key in requested) {
    const clr = layer.clr;
    const colorName = requested[key];
    if (clr.hasOwnProperty(colorName)) {
      clr[colorName] = constructNamedColor(colorName, layer, theme);
    }
    colors[key] = clr[colorName].str;
  }
}