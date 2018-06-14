import { ISeedColors, IColorPalette, ILayerSets } from "./IColorPalette";
import { getColorFromString, IColor } from "../coloring/color";
import { getContrastRatio, getShadeArray } from "../coloring/shading";
import { IColorLayerKey } from "./IColorLayerKey";
import { IColorDefinitions } from "./IThemeSettings";

const bgType = 'bg';
const accentType = 'accent';
const fallbackBg: IColor = { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' };

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
  let colors: { [key: string]: IColor[] } = { };

  // convert colors in the color definitions
  for (const key in def) {
    if (def.hasOwnProperty(key)) {
      const params = def[key];
      if (params) {
        if (typeof params.color === 'string') {
          const invertAt = params.invertAt || 50;
          const rotate: boolean = params.anchorColor || false;
          const count = 9;
          const low = 30;
          const high = 100;
          const seedColor = getColorFromString(params.color) || fallbackBg;
          colors[key] = getShadeArray(seedColor, count, false, rotate, low, high, invertAt);
        } else {
          colors[key] = convertColorArray(params.color, fallbackColors.bg);
        }
      }
    }
  }

  // if we have a base palette specified pull from that in case there are custom arrays
  if (base) {
    colors = Object.assign({}, base.colors, colors);
  }

  return {
    colors: colors as ILayerSets
  }
}

const fallbackColors: ISeedColors = {
  fg: { h: 0, s: 0, v: 0, a: 100, str: '#000000' },
  bg: { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' },
  accent: { h: 212.26, s: 100, v: 83.14, a: 100, str: '#0062d4' }
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