import { ITextColorStyles, IColorFunction, IResolvedColor } from ".";
import { DefaultFgParams, IPalettes, addNamedPalette } from "../palettes";
import { getContrastRatio } from "../../../coloring/shading";
import { IColor } from "../../../coloring/color";

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
    paletteConfig: { color: 'green', anchorColor: true },
    keepTone: true
  },
  error: {
    palette: 'error',
    paletteConfig: { color: 'red', anchorColor: true },
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
  let bestIndex = 0;
  let bestRatio: number = getContrastRatio(bgColor, palette[bestIndex]);
  for (let i = 1; i < palette.length; i++) {
    const newRatio: number = getContrastRatio(bgColor, palette[i]);
    if (newRatio > bestRatio) {
      bestRatio = newRatio;
      bestIndex = i;
    }
  }
  return { val: palette[bestIndex], fn: input };
}
