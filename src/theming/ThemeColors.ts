import { ISeedColors, IColorPalette, ILayerSets } from "./IColorPalette";
import { getColorFromString, IColor } from "../coloring/color";
import { getContrastRatio, getShadeArray } from "../coloring/shading";
import { IColorLayerKey } from "./IColorLayerKey";
import { IColorDefinitions, IThemeColors } from "./IThemeSettings";

const bgType = 'bg';
const accentType = 'accent';

export function flipType(type: string): 'bg' | 'accent' {
  return (type === accentType) ? bgType : accentType;
}

export function resolveKey(key: IColorLayerKey, base?: IColorLayerKey): IColorLayerKey {
  const { type, shade } = key;
  const baseType = base ? base.type : bgType;
  const baseShade = base ? base.shade : 0;
  switch (type) {
    case 'switch':
      return { type: flipType(baseType), shade };
    case 'rel':
      return { type: baseType, shade: shade + baseShade };
    case 'relswitch':
      return { type: flipType(baseType), shade: shade + baseShade };
  }
  return key;
}

export function isFnKey(key: IColorLayerKey): boolean {
  return key.type === 'fn' && key.name !== undefined;
}

/**
 * Creates an IColorPalette based on the given set of inputs.
 * 
 * @param def A partial set of color definitions.  This typically includes one or more seed colors
 * as well as optionally including predefined swatch arrays.
 * 
 * @param base A baseline palette to use for creation.  Unspecfied seed colors will be picked up
 * from here and as will custom swatch arrays.  Default arrays will be recreated. 
 */
export function createPalette(def: Partial<IColorDefinitions>, base?: IColorPalette): IColorPalette {
  const baseSeeds = base ? base.seeds : undefined;
  const seeds = getSeedColors(def, baseSeeds)
  let colors: { [key: string]: IColor[] } = { };

  // if any swatch arrays are specified then convert them from strings to IColors
  if (def.swatches) {
    for (const swatch in def.swatches) {
      if (def.swatches.hasOwnProperty(swatch)) {
        colors[swatch] = convertColorArray(def.swatches[swatch], fallbackColors.bg);
      }
    }
  }

  // now do the calculated sets for ones that are not specified
  const keys: Array<'bg'|'accent'|'fg'> = ['bg', 'accent', 'fg'];
  const invert: boolean = def.invert !== undefined ? def.invert : false;
  for (const key of keys) {
    if (!colors.hasOwnProperty(key)) {
      const invertActual = key === 'fg' ? !invert : invert;
      const rotate = (key === 'bg' && def.useBgForTone !== undefined) ? !def.useBgForTone : true;
      colors[key] = getShadeArray(seeds[key], PALETTE_LAYER_COUNT, invertActual, rotate, 30, 100, 50);
    }
  }

  // if we have a base palette specified pull from that in case there are custom arrays
  if (base) {
    colors = Object.assign({}, base.colors, colors);
  }

  return {
    seeds,
    colors: colors as ILayerSets
  }
}

// count of layers, this should be dynamic but currently matches what is in shades.ts
const PALETTE_LAYER_COUNT: number = 9;

const fallbackColors: ISeedColors = {
  fg: { h: 0, s: 0, v: 0, a: 100, str: '#000000' },
  bg: { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' },
  accent: { h: 212.26, s: 100, v: 83.14, a: 100, str: '#0062d4' }
}

function getSeedColors(colors: Partial<IThemeColors>, base?: ISeedColors): ISeedColors {
  const result = { };
  for (const key in fallbackColors) {
    if (colors.hasOwnProperty(key)) {
      const color = getColorFromString(colors[key]);
      if (color) {
        result[key] = color;
      }
    }
  }
  return Object.assign({}, base ? base : fallbackColors, result);
}

function convertColorArray(colors: string[], fallback: IColor): IColor[] {
  return colors.map((val) => (getColorFromString(val) || fallback));
}

function getAutoFg(palette: IColorPalette, bgKey: IColorLayerKey): IColor {
  const bgColor = resolveColor(palette, bgKey);
  const fgs = palette.colors.fg;
  let bestIndex = 0;
  let bestRatio: number = getContrastRatio(bgColor, fgs[bestIndex]);
  for (let i = 1; i < fgs.length; i++) {
    const newRatio: number = getContrastRatio(bgColor, fgs[i]);
    if (newRatio > bestRatio) {
      bestRatio = newRatio;
      bestIndex = i;
    }
  }
  return fgs[bestIndex];
}

export function resolveColor(palette: IColorPalette, key: IColorLayerKey, base?: IColorLayerKey): IColor {
  const colorSets = palette.colors;
  if (colorSets.hasOwnProperty(key.type)) {
    const colors = colorSets[key.type];
    return colors[key.shade % colors.length];
  }
  const fallbackKey: IColorLayerKey = { type: bgType, shade: 0 };

  if (isFnKey(key) && key.name) {
    if (key.name === 'autofg') {
      return getAutoFg(palette, base || fallbackKey);
    }
  }

  return resolveColor(palette, fallbackKey);
}