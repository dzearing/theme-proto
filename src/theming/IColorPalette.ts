import { IColor } from "../coloring/color";
import { IColorLayer } from "./IColorLayer";
import { getShade, getBackgroundShade, getContrastRatio } from "../coloring/shading";
import { IColorLayerKey, ColorLayerType } from "./IColorLayerKey";
import { ITheme, ILayerCache } from "./ITheme";
import { constructNamedColor } from "./Transforms";

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

function getCustomLayer(name: string, theme: ITheme): IColorLayer {
  const layers = theme.layers;
  if (!layers.hasOwnProperty(name)) {
    const offsets = theme.offsets;
    if (offsets.hasOwnProperty(name)) {
      layers[name] = getLayer(offsets[name], theme);
    } else if (name !== 'default') {
      return getCustomLayer('default', theme);
    }
  }
  return layers[name];
}

export function getLayer(key: IColorLayerKey, theme: ITheme): IColorLayer {
  if (key.type === ColorLayerType.Custom && key.name) {
    return getCustomLayer(key.name, theme);
  } else if (key.type === ColorLayerType.Bg || key.type === ColorLayerType.Accent) {
    const accent: boolean = (key.type === ColorLayerType.Accent);
    const colors = theme.colors;
    const layers = accent ? colors.themeLayers : colors.bgLayers;
    const colorVals = accent ? colors.themes : colors.bgs;

    if (key.shade >= colorVals.length) {
      key = { ...key, shade: (key.shade % colors.bgs.length)};
    }
    if (!layers[key.shade]) {
      layers[key.shade] = createLayerForBackground(key, colorVals[key.shade], colors);
    }
    return layers[key.shade];
  }
  // absolute fallback right now is to just return the default layer
  return getCustomLayer('default', theme);
}

export function getLayerFromKeys(key: IColorLayerKey, baseline: IColorLayerKey, theme: ITheme): IColorLayer {
  const bgLayer: boolean = (baseline.type === ColorLayerType.Bg);
  const shade = baseline.shade;
  switch (key.type) {
    case ColorLayerType.Relative:
      key = { ...key, shade: shade + key.shade };
      break;
    case ColorLayerType.Switch:
      key = { ...key, type: bgLayer ? ColorLayerType.Accent : ColorLayerType.Bg };
      break;
    case ColorLayerType.SwitchRel:
      key = { ...key, type: bgLayer ? ColorLayerType.Accent : ColorLayerType.Bg, shade: shade + key.shade };
      break;
  }
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
      return getThemeColors('default', theme, requested);
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