import { IColor } from "../coloring/color";
import { IColorLayer } from "./IColorLayer";
import { getShade, getBackgroundShade } from "../coloring/shading";

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
  custom: { [key: string]: IColorLayer };
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
    custom: {}
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