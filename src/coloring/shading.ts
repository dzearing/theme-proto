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
  createColor
} from '.';
// import * as Colors from './colors';
import { assign } from '@uifabric/utilities';
import { MAX_COLOR_VALUE } from './colorConversion';

// Soften: to get closer to the background color's luminance (softening with a white background would be lightening, with black it'd be darkening)
// Strongen: opposite of soften
// Luminance multiplier constants for generating shades of a given color
const WhiteShadeTableBG = [.027, .043, .082, .145, .184, .216, .349, .537]; // white bg
const BlackTintTableBG = [.537, .45, .349, .216, .184, .145, .082, .043]; // black bg
const WhiteShadeTable = [.537, .349, .216, .184, .145, .082, .043, .027]; // white fg
const BlackTintTable = [.537, .45, .349, .216, .184, .145, .082, .043]; // black fg
const LumTintTable = [.88, .77, .66, .55, .44, .33, .22, .11]; // light (strongen all)
const LumShadeTable = [.11, .22, .33, .44, .55, .66, .77, .88]; // dark (soften all)
const ColorTintTable = [.960, .840, .700, .400, .120]; // default soften
const ColorShadeTable = [.100, .240, .440]; // default strongen
// If the given shade's luminance is below/above these values, we'll swap to using the White/Black tables above
const LowLuminanceThreshold = 0.2;
const HighLuminanceThreshold = 0.8;

/** Shades of a given color, from softest to strongest. */
export enum Shade {
  Unshaded = 0,
  Shade1 = 1,
  Shade2 = 2,
  Shade3 = 3,
  Shade4 = 4,
  Shade5 = 5,
  Shade6 = 6,
  Shade7 = 7,
  Shade8 = 8,
  // remember to update isValidShade()!
}

/**
 * Returns true if the argument is a valid Shade value
 * @param {Shade} shade The Shade value to validate.
 */
export function isValidShade(shade?: Shade): boolean {
  'use strict';
  return (typeof shade === 'number') && (shade >= Shade.Unshaded) && (shade <= Shade.Shade8);
}

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