import { ITextColorStyles, IColorFunction, IResolvedColor } from ".";
import { DefaultFgParams, IPalettes, addNamedPalette } from "../palettes";
import { getContrastRatio } from "../../../coloring/shading";
import { IColor } from "../../../coloring/color";

const fgPaletteKey = 'fg';
const requiredContrast: number = 4.5;

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
    paletteConfig: { color: 'green', anchorColor: true, invertAt: 100 },
    keepTone: true
  },
  error: {
    palette: 'error',
    paletteConfig: { color: 'red', anchorColor: true, invertAt: 100 },
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
  if (!style.keepTone) {
    let bestIndex = style.darkOffset || 0;
    const end = palette.length - (style.lightOffset ? style.lightOffset : 0);
    let bestRatio: number = getContrastRatio(bgColor, palette[bestIndex]);
    for (let i = (bestIndex + 1); i < end; i++) {
      const newRatio: number = getContrastRatio(bgColor, palette[i]);
      if (newRatio > bestRatio) {
        bestRatio = newRatio;
        bestIndex = i;
      }
    }
    return { val: palette[bestIndex], fn: input };
  } else {
    for (const swatch of palette) {
      const ratio = getContrastRatio(bgColor, swatch);
      if (ratio > requiredContrast) {
        return { val: swatch, fn: input };
      }
    }
  }
  return { val: palette[0], fn: input };
}
