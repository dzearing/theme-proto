// Technically this should be shades and tints, but for simplicity we'll call everything a shade.
/* This utility module is used with theming. Given a color to shade, whether the theme is inverted (i.e. is a dark color),
 * and the desired shade enum, this will return an appropriate shade of that color.
 */
import {
  IHSV,
  IColor,
  lumFromColor,
  IHSL,
  hslFromColor,
  hsvFromColor,
  createColor,
  rgbFromColor
} from '.';
// import * as Colors from './colors';
import { MAX_COLOR_VALUE } from './colorConversion';

export const MIN_CONTRAST_RATIO: number = 4.5;

function _isBlack(color: IColor): boolean {
  return hsvFromColor(color).v === 0;
}

function _isWhite(color: IColor): boolean {
  const hsv = hsvFromColor(color);
  return hsv.v === MAX_COLOR_VALUE && hsv.s === 0;
}

function _darken(hsv: IHSV, factor: number): IHSV {
  return {
    h: hsv.h,
    s: hsv.s,
    v: _clamp(hsv.v - (hsv.v * factor), 0, 100)
  };
}

function _lighten(hsv: IHSV, factor: number): IHSV {
  return {
    h: hsv.h,
    s: _clamp(hsv.s - (hsv.s * factor), 0, 100),
    v: _clamp(hsv.v + ((100 - hsv.v) * factor), 0, 100)
  };
}

function _clamp(n: number, min: number, max: number) {
  return n; // Math.max(min, Math.min(n, max));
}

export function isDark(color: IColor): boolean {
  return hslFromColor(color).l < 50;
}

function _probeIndex(start: number, first: number, last: number, count: number): number {
  const offset: number = (count % 2) === 0 ? -Math.floor(count / 2) : Math.floor((count + 1) / 2);
  const size = last - first + 1;
  let index = start + offset;
  if (index > last) {
    index -= size;
  } else if (index < first) {
    index += size;
  }
  return index;
}

export function findContrastingColor(colors: Array<IColor>, bg: IColor, start: number, first: number, last: number, closest: boolean): number {
  let bestIndex: number = start;
  let bestRatio: number = getContrastRatio(colors[bestIndex], bg);
  if (closest && bestRatio >= MIN_CONTRAST_RATIO) {
    return start;
  }
  const totalElements: number = last - first + 1;
  for (let i = 1; i < totalElements; i++) {
    const index = _probeIndex(start, first, last, i);
    const ratio = getContrastRatio(colors[index], bg);
    if (ratio > bestRatio) {
      bestIndex = index;
      bestRatio = ratio;
    }
    if (closest && ratio >= MIN_CONTRAST_RATIO) {
      return index;
    }
  }
  return bestIndex;
}

function insertSeededColor(colors: Array<IColor>, original: IColor): number {
  const count = colors.length;
  const lumOrig = hslFromColor(original).l;
  let gap = 1000;
  let found = 0;
  for (let i = 0; i < count; i++) {
    const hsl = hslFromColor(colors[i]);
    const newGap = Math.abs(hsl.l - lumOrig);
    if (newGap < gap) {
      gap = newGap;
      found = i;
    }
  }
  colors[found] = original;
  return found;
}

function interpolateToNext(colors: Array<IColor>, start: number, nextLum: number, a: number): number {
  const hsl = hslFromColor(colors[start]);
  const colorTarget = createColor({ ...hsl, l: nextLum }, a);
  const lumRatio = lumFromColor(colorTarget);
  const last = Math.max(start + 1, Math.round(lumRatio * (colors.length - 1)));
  if (last > start && last < colors.length) {
    colors[last] = colorTarget;
    if ((start + 1) < last) {
      const numToFill = last - (start + 1);
      const step = (hslFromColor(colorTarget).l - hsl.l) / (numToFill + 1);
      for (let i = 1; (start + i) < last; i++) {
        colors[start + i] = createColor({ ...hsl, l: (hsl.l + (step * i)) }, a)
      }
    }
  }
  return last;
}

const interpolationValues: number[] = [0, 30, 50, 75, 100];

export function getLumAdjustedShadeArray(
  color: IColor,
  count: number,
  rotate: boolean,
  tonalOnly: boolean,
  autoInvert: number = 50
): IColor[] {
  const hslBase = hslFromColor(color);
  const a = rgbFromColor(color).a;
  const reverse = (hslBase.l <= autoInvert);
  const lums = interpolationValues;
  count = Math.max(Math.floor(count + (tonalOnly ? 2 : 0)), lums.length);
  let colors = new Array<IColor>(count);
  let colorIndex = 0;
  let lumIndex = 0;
  colors[colorIndex] = createColor({ ...hslBase, l: lums[lumIndex++] }, a);
  while (lumIndex < lums.length && colorIndex < count) {
    colorIndex = interpolateToNext(colors, colorIndex, lums[lumIndex++], a);
  }
  if (tonalOnly) {
    colors = colors.slice(1, colors.length - 1);
  }
  if (!reverse) {
    colors.reverse();
  }
  const originalIndex = insertSeededColor(colors, color);
  if (rotate && originalIndex !== 0) {
    colors = colors.slice(originalIndex, colors.length).concat(colors.slice(0, originalIndex));
  }
  return colors;
}

/**
 * This will generate a shade array for a given color.  The color is converted to
 * hsl, at which point the luminance value will be interpolated across the slots in
 * the array
 * @param color color to use for generating the shade array
 * @param count count of colors to put in the array
 * @param reverse arrange the colors in descending order
 * @param rotate rotate the values such that color is at index 0
 * @param low minimum luminance value in the array (0 to 100)
 * @param high maximum luminance value in the array (0 to 100)
 */
export function getShadeArray(
  color: IColor,
  count: number,
  reverse: boolean,
  rotate: boolean,
  low: number = 0,
  high: number = 100,
  autoinvert: number = 50,
): IColor[] {
  const a = color.rgb.a;
  const hsl: IHSL = hslFromColor(color);
  if (autoinvert) {
    reverse = hsl.l < autoinvert;
  }
  low = Math.min(hsl.l, low);
  high = Math.max(hsl.l, high);
  const startLum = reverse ? low : high;
  const endLum = reverse ? high : low;
  const maxIndex = count - 1;
  const range = endLum - startLum;
  const offset = (hsl.l - startLum) / range;
  const slot = Math.min(Math.max(Math.round(offset * maxIndex), 0), maxIndex);
  let result = new Array<IColor>(count);

  result[0] = createColor({ ...hsl, l: startLum }, a);
  result[maxIndex] = createColor({ ...hsl, l: endLum }, a);
  if (slot > 0 && slot < maxIndex) {
    result[slot] = createColor(hsl, a);
  }

  if (slot > 1) {
    const step = (hsl.l - startLum) / slot;
    for (let i = 1; i < slot; i++) {
      result[i] = createColor({ ...hsl, l: startLum + (step * i) }, a);
    }
  }

  if ((slot + 1) < maxIndex) {
    const step = (endLum - hsl.l) / (maxIndex - slot);
    for (let i = 1; (i + slot) < maxIndex; i++) {
      result[i + slot] = createColor({ ...hsl, l: hsl.l + (step * i) }, a);
    }
  }

  if (rotate && slot !== 0) {
    result = result.slice(slot, result.length).concat(result.slice(0, slot));
  }

  return result;
}

export function getContrastRatio(color1: IColor, color2: IColor): number {
  const L1 = lumFromColor(color1) + .05;
  const L2 = lumFromColor(color2) + .05;

  // return the lighter color divided by darker
  return L1 / L2 > 1 ?
    L1 / L2 : L2 / L1;
}