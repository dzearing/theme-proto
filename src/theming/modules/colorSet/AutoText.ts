import { ITextColorStyles, IColorFunction, IResolvedColor } from ".";
import { DefaultFgParams, IPalettes, addNamedPalette } from "../palettes";
import { getContrastRatio, findContrastingColor } from "../../../coloring/shading";
import { IColor } from "../../../coloring";

const fgPaletteKey = 'fg';

const TextColorStyles: ITextColorStyles = {
  default: {
    palette: fgPaletteKey,
    paletteConfig: DefaultFgParams
  },
  soft: {
    palette: fgPaletteKey,
    paletteConfig: DefaultFgParams,
    darkOffset: 1,
  },
  light: {
    palette: fgPaletteKey,
    paletteConfig: DefaultFgParams,
    lightOffset: 1,
    darkOffset: 2
  },
  success: {
    palette: 'success',
    paletteConfig: { color: 'green', anchorColor: true, invertAt: 100, tonalOnly: true },
    keepTone: true
  },
  error: {
    palette: 'error',
    paletteConfig: { color: 'red', anchorColor: true, invertAt: 100, tonalOnly: true },
    keepTone: true
  }
}

export function AutoText(input: IColorFunction, palettes: IPalettes, bg: IResolvedColor): IResolvedColor {
  const style = input.textStyle && TextColorStyles.hasOwnProperty(input.textStyle) ? TextColorStyles[input.textStyle] : TextColorStyles.default;
  if (!palettes.hasOwnProperty(style.palette)) {
    addNamedPalette(palettes, style.palette, style.paletteConfig);
  }
  const palette: IColor[] = palettes[style.palette!];
  const bgColor = bg.val;
  const first = style.darkOffset || 0;
  const last = palette.length - 1 - (style.lightOffset || 0);
  const bestIndex = findContrastingColor(palette, bgColor, first, first, last, style.keepTone || false);
  return { val: palette[bestIndex], fn: input };
}
