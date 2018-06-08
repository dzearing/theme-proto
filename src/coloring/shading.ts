// Technically this should be shades and tints, but for simplicity we'll call everything a shade.
/* This utility module is used with theming. Given a color to shade, whether the theme is inverted (i.e. is a dark color),
 * and the desired shade enum, this will return an appropriate shade of that color.
 */
import {
  IHSV,
  IColor,
  MAX_COLOR_VALUE,
  hsv2hsl,
  getColorFromRGBA,
  hsv2rgb,
  createColorFromHSVA,
  getLuminanceForColor,
  IHSL,
  createColorFromHSLA
} from './color';
// import * as Colors from './colors';
import { assign } from '@uifabric/utilities/lib/index';

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
  return color.v === 0;
}

function _isWhite(color: IColor): boolean {
  return color.v === MAX_COLOR_VALUE && color.s === 0;
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
  return hsv2hsl(color.h, color.s, color.v).l < 50;
}

interface IShadingParameters {
  hsl: IHSL;        // color to use for shading
  slot: number;     // index 
  count: number;    // number of entries in the array
  low: number;      // luminance min value, 0-100
  high: number;     // luminance max value, 0-100
  reverse: boolean; // go from dark to light instead of light to dark
}

export function getShadingParams(hsl: IHSL, count: number, reverse: boolean, low: number = 0, high: number = 100): IShadingParameters {
  low = Math.min(hsl.l, low);
  high = Math.max(hsl.l, high);
  const range = high - low;
  const offset = hsl.l / range;
  const maxIndex = count - 1;
  const slot = Math.min(Math.max(Math.round(offset * maxIndex), 0), maxIndex);
  return { hsl, slot, count, low, high, reverse };
}

function interpolateShades(shades: IHSL[], start: number, last: number) {
  const { h, s, l } = shades[start];
  const reverse = last < start;
  let luminance = reverse ? 0 : MAX_COLOR_VALUE;
  const steps = Math.abs(last - start);
  const lumDelta = (l - luminance) / steps;
  const delta = reverse ? 1 : -1;

  for (let i = last; i !== start; i += delta) {
    shades[i] = { h, s, l};
    shades[i].l = luminance;
    luminance += lumDelta;
  }
}

export function getShades(color: IColor, count: number, margins: number, invert: boolean): IColor[] {
  const maxLum = MAX_COLOR_VALUE;
  const hsl = hsv2hsl(color.h, color.s, color.v);
  const shadeCount = count + (margins * 2);
  const shades = new Array<IHSL>(shadeCount);
  const step = maxLum / (shadeCount - 1);
  const slot = Math.min(Math.floor((hsl.l + (step / 2)) / step), shadeCount - 1);

  // set the specified color into the closest slot value
  shades[slot] = hsl;

  // interpolate shades to the end
  interpolateShades(shades, slot, 0);
  interpolateShades(shades, slot, shadeCount - 1);

  for (let i = 0; i < margins; i++) {
    shades.pop();
    shades.slice();
  }

  // now return the mapped array
  return shades.map((val: IHSL) => createColorFromHSLA(val.h, val.s, val.l, color.a))
}

/**
 * Given a color and a shade specification, generates the requested shade of the color.
 * Logic:
 * if white
 *  darken via tables defined above
 * if black
 *  lighten
 * if light
 *  strongen
 * if dark
 *  soften
 * else default
 *  soften or strongen depending on shade#
 * @param {IColor} color The base color whose shade is to be computed
 * @param {Shade} shade The shade of the base color to compute
 * @param {Boolean} isInverted Default false. Whether the given theme is inverted (reverse strongen/soften logic)
 */
export function getShade(color: IColor, shade: Shade, isInverted: boolean = false): IColor {
  'use strict';

  if (shade === Shade.Unshaded || !isValidShade(shade)) {
    return color;
  }

  const hsl = hsv2hsl(color.h, color.s, color.v);
  let hsv = { h: color.h, s: color.s, v: color.v };
  const tableIndex = shade - 1;
  let _soften = _lighten;
  let _strongen = _darken;
  if (isInverted) {
    _soften = _darken;
    _strongen = _lighten;
  }
  if (_isWhite(color)) { // white
    hsv = _darken(hsv, WhiteShadeTable[tableIndex]);
  } else if (_isBlack(color)) { // black
    hsv = _lighten(hsv, BlackTintTable[tableIndex]);
  } else if (hsl.l / 100 > HighLuminanceThreshold) { // light
    hsv = _strongen(hsv, LumShadeTable[tableIndex]);
  } else if (hsl.l / 100 < LowLuminanceThreshold) { // dark
    hsv = _soften(hsv, LumTintTable[tableIndex]);
  } else { // default
    if (tableIndex < ColorTintTable.length) {
      hsv = _soften(hsv, ColorTintTable[tableIndex]);
    } else {
      hsv = _strongen(hsv, ColorShadeTable[tableIndex - ColorTintTable.length]);
    }
  }

  return createColorFromHSVA(hsv.h, hsv.s, hsv.v, color.a);
}

// Background shades/tints are generated differently. The provided color will be guaranteed
//   to be the darkest or lightest one. If it is <50% luminance, it will always be the darkest,
//   otherwise it will always be the lightest.
export function getBackgroundShade(color: IColor, shade: Shade, isInverted: boolean = false): IColor {
  'use strict';

  if (shade === Shade.Unshaded || !isValidShade(shade)) {
    return color;
  }

  let hsv = { h: color.h, s: color.s, v: color.v };
  const tableIndex = shade - 1;
  if (!isInverted) { // lightish
    hsv = _darken(hsv, WhiteShadeTableBG[tableIndex]);
  } else { // default: if (hsl.l / 100 < .5) { // darkish
    hsv = _lighten(hsv, BlackTintTableBG[BlackTintTable.length - 1 - tableIndex]);
  }

  return getColorFromRGBA(assign(hsv2rgb(hsv.h, hsv.s, hsv.v), { a: color.a }));
}

export function getContrastRatio(color1: IColor, color2: IColor): number {
  const L1 = getLuminanceForColor(color1) + .05;
  const L2 = getLuminanceForColor(color2) + .05;

  // return the lighter color divided by darker
  return L1 / L2 > 1 ?
    L1 / L2 : L2 / L1;
}