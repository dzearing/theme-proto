import { IHSV, IRGB } from ".";

export const MAX_COLOR_SATURATION = 100;
export const MAX_COLOR_HUE = 359;
export const MAX_COLOR_VALUE = 100;
export const MAX_COLOR_RGBA = 255;

export function rgb2hex(r: number, g: number, b: number): string {
  return [
    _numberToPaddedHex(r),
    _numberToPaddedHex(g),
    _numberToPaddedHex(b)
  ].join('');
}

export function hsv2hex(h: number, s: number, v: number): string {
  const { r, g, b } = hsv2rgb(h, s, v);

  return rgb2hex(r, g, b);
}

export function rgb2hsv(r: number, g: number, b: number): IHSV {
  let h = NaN;
  let s;
  let v;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // hue
  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = ((g - b) / delta) % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else if (b === max) {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  // saturation
  s = Math.round((max === 0 ? 0 : (delta / max)) * 100);

  // value
  v = Math.round(max / 255 * 100);

  return { h, s, v };
}

export function hsl2hsv(h: number, s: number, l: number): IHSV {
  s *= ((l < 50) ? l : (100 - l)) / 100;
  let sMod = 2 * s / (l + s) * 100;
  if (isNaN(sMod)) {
    sMod = 0;
  }

  return {
    h,
    s: sMod,
    v: l + s
  };
}

export function hsv2hsl(h: number, s: number, v: number): { h: number, s: number, l: number } {
  s /= MAX_COLOR_SATURATION;
  v /= MAX_COLOR_VALUE;

  let l = (2 - s) * v;
  let sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;

  return { h, s: sl * 100, l: l * 100 };
}

export function hsl2rgb(h: number, s: number, l: number): IRGB {
  const hsv = hsl2hsv(h, s, l);

  return hsv2rgb(hsv.h, hsv.s, hsv.v);
}

export function hsv2rgb(h: number, s: number, v: number): IRGB {
  s = s / 100;
  v = v / 100;

  let rgb: number[] = [];

  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs(hh % 2 - 1));
  const m = v - c;

  switch (Math.floor(hh)) {
    case 0:
      rgb = [c, x, 0];
      break;

    case 1:
      rgb = [x, c, 0];
      break;

    case 2:
      rgb = [0, c, x];
      break;

    case 3:
      rgb = [0, x, c];
      break;

    case 4:
      rgb = [x, 0, c];
      break;

    case 5:
      rgb = [c, 0, x];
      break;
  }

  return {
    r: Math.round(MAX_COLOR_RGBA * (rgb[0] + m)),
    g: Math.round(MAX_COLOR_RGBA * (rgb[1] + m)),
    b: Math.round(MAX_COLOR_RGBA * (rgb[2] + m)),
    a: 100
  };
}

function _numberToPaddedHex(num: number): string {
  const hex = num.toString(16);

  return hex.length === 1 ? '0' + hex : hex;
}

export function getRelativeLuminance(rgb: IRGB): number {
  // Formula defined by: http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef
  // relative luminance: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  /* calculate the intermediate value needed to calculating relative luminance */
  function _getIntermediate(x: number): number {
    if (x <= .03928) {
      return x / 12.92;
    } else {
      return Math.pow((x + .055) / 1.055, 2.4);
    }
  }

  // could we get rid of the MAX_COLOR_RGBA divisions here by just modifying the calculation above?
  const r: number = _getIntermediate(rgb.r / MAX_COLOR_RGBA);
  const g: number = _getIntermediate(rgb.g / MAX_COLOR_RGBA);
  const b: number = _getIntermediate(rgb.b / MAX_COLOR_RGBA);

  return (.2126 * r) + (.7152 * g) + (.0722 * b);
}