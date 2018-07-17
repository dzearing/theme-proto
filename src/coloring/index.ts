import { rgb2hsv, hsv2hsl, getRelativeLuminance, hsv2rgb, hsl2hsv, rgb2hex } from "./colorConversion";
import { cssColor } from "./colorParsing";


export interface IRGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface IHSV {
  h: number;
  s: number;
  v: number;
}

export interface IHSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Color type, generally just a string and an RGBA value but if additional conversions are
 * done they are cached within.  The code is set to treat this as an object that gets built
 * up over time but is not changed.  To change it create a new color.
 */
export interface IColor {
  /** css string value, must be set */
  str: string;
  /** rgb, always available */
  rgb: IRGB;
  /** hsl, cached if it is ever calculated */
  hsl?: IHSL;
  /** hsv, cached if it is ever calculated */
  hsv?: IHSV;
  /** relative luminance, cached when calculated */
  lum?: number;   // luminance, cached to avoid calculating it over and over
}

export function hsvFromColor(color: IColor): IHSV {
  if (!color.hsv) {
    const { r, g, b } = color.rgb;
    color.hsv = rgb2hsv(r, g, b);
  }
  return color.hsv;
}

export function hslFromColor(color: IColor): IHSL {
  if (!color.hsl) {
    const { h, s, v } = hsvFromColor(color);
    color.hsl = hsv2hsl(h, s, v);
  }
  return color.hsl;
}

export function rgbFromColor(color: IColor): IRGB {
  return color.rgb;
}

export function lumFromColor(color: IColor): number {
  if (!color.lum) {
    color.lum = getRelativeLuminance(color.rgb);
  }
  return color.lum;
}

export function colorFromString(inputColor: string): IColor | undefined {
  const rgb = cssColor(inputColor);

  if (!rgb) {
    return;
  }

  return { str: inputColor, rgb };
}

export function createColor(input: IRGB | IHSV | IHSL, a?: number): IColor {
  const result: Partial<IColor> = {};

  if (input.hasOwnProperty('r')) {
    result.rgb = input as IRGB;
  } else if (input.hasOwnProperty('v')) {
    result.hsv = input as IHSV;
  } else {
    result.hsl = input as IHSL;
  }

  if (result.hsl) {
    const { h, s, l } = result.hsl;
    result.hsv = hsl2hsv(h, s, l);
  }

  if (result.hsv) {
    const { h, s, v } = result.hsv;
    result.rgb = hsv2rgb(h, s, v);
  }

  if (a !== undefined) {
    result.rgb!.a = a;
  } else {
    a = result.rgb!.a;
  }

  const { r, g, b } = result.rgb!;
  result.str = (a === 100) ? `#${rgb2hex(r, g, b)}` : `rgba(${r}, ${g}, ${b}, ${a / 100})`;
  return result as IColor;
}
