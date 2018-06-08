import { ISeedColors, IColorPalette, ILayerSets } from "./IColorPalette";
import { getColorFromString, IColor } from "../coloring/color";
import { IColorDefinitions, IThemeColors } from "./IColorDefinition";
import { getBackgroundShade, getShade, getContrastRatio } from "../coloring/shading";
import { IColorLayerKey, isIndexKey, resolveKey } from "./IColorLayerKey";
import { IColorLayer } from "./IColorLayer";
import { ITheme } from "./ITheme";
import { getThemeLayer } from "./ThemeCache";


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
  const colors: { [key: string]: IColor[] } = { };

  // if any swatch arrays are specified then convert them from strings to IColors
  if (def.swatches) {
    for (const swatch in def.swatches) {
      if (colors.hasOwnProperty(swatch)) {
        colors[swatch] = convertColorArray(def.swatches[swatch], fallbackColors.bg);
      }
    }
  }

  // now do the calculated sets for ones that are not specified
  const keys: Array<'bg'|'accent'> = ['bg', 'accent'];
  for (const key of keys) {
    if (!colors.hasOwnProperty(key)) {
      colors[key] = createGeneratedArray(seeds[key], key)
    }
  }

  // finally build the actual layer arrays
  let layers = { };
  for (const key in colors) {
    if (colors.hasOwnProperty(key)) {
      layers[key] = colors[key].map((val: IColor, index: number) => {
        return createLayerForBackground({type: key, shade: index}, colors[key][index], seeds);
      })
    }
  }

  // if we have a base palette specified pull from that in case there are custom arrays
  if (base) {
    layers = Object.assign({}, base.layers, layers);
  }

  return {
    seeds,
    layers: layers as ILayerSets
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

function createGeneratedArray(seedColor: IColor, type: 'bg' | 'accent'): IColor[] {
  const results: IColor[] = new Array<IColor>(PALETTE_LAYER_COUNT);
  for (let i: number = 0; i < PALETTE_LAYER_COUNT; i++) {
    results[i] = type === 'bg' ? getBackgroundShade(seedColor, i, false) : getShade(seedColor, i, false);
  }
  return results;
}

function createLayerForBackground(key: IColorLayerKey, newBg: IColor, seeds: ISeedColors): IColorLayer {
  const bgRatio: number = getContrastRatio(newBg, seeds.bg);
  const fgRatio: number = getContrastRatio(newBg, seeds.fg);
  const fg = fgRatio > bgRatio ? seeds.fg : seeds.bg;
  return {key, clr: { fg, bg: newBg }} as IColorLayer;
}

export function getLayer(key: IColorLayerKey, theme: ITheme): IColorLayer {
  if (key.name) {
    return getThemeLayer(theme, key.name);
  } else if (isIndexKey(key)) {
    // these will be pre-created, just scope the key to fit
    let shade = key.shade;
    const layers = theme.colors.layers[key.type];
    
    if (shade >= layers.length) {
      shade = (shade % layers.length);
    }
    return layers[shade];
  }
  // absolute fallback right now is to just return the default layer
  return getThemeLayer(theme);
}

export function getLayerFromKeys(key: IColorLayerKey, baseline: IColorLayerKey, theme: ITheme): IColorLayer {
  key = resolveKey(key, baseline);
  return getLayer(key, theme);
}

