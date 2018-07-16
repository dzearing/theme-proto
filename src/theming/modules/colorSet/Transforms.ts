import { ColorFunction, IColorFunction, IResolvedColor } from '.';
import { IPalettes } from '../palettes';
import { getContrastRatio } from '../../../coloring/shading';

export interface IColorTransforms {
  autofg: ColorFunction;
  deepen: ColorFunction;
  swap: ColorFunction;
}

export function ExecuteTransform(input: IColorFunction, palettes: IPalettes, bg: IResolvedColor): IResolvedColor {
  if (ColorTransforms.hasOwnProperty(input.fn)) {
    return ColorTransforms[input.fn](input, palettes, bg);
  }
  return ColorTransforms.autofg(input, palettes, bg);
}

const ColorTransforms: IColorTransforms = {
  autofg: AutoForeground,
  deepen: DeepenColor,
  swap: SwapColors
}

function AutoForeground(input: IColorFunction, palettes: IPalettes, bg: IResolvedColor): IResolvedColor {
  const fgs = palettes.fg;
  const bgColor = bg.val;
  let bestIndex = 0;
  let bestRatio: number = getContrastRatio(bgColor, fgs[bestIndex]);
  for (let i = 1; i < fgs.length; i++) {
    const newRatio: number = getContrastRatio(bgColor, fgs[i]);
    if (newRatio > bestRatio) {
      bestRatio = newRatio;
      bestIndex = i;
    }
  }
  return { val: fgs[bestIndex], fn: input };
}

function DeepenColor(input: IColorFunction, palettes: IPalettes, bg: IResolvedColor): IResolvedColor {
  if (input.p1 && typeof input.p1 === 'number') {
    const shift = input.p1;
    if (bg.key) {
      const { palette, shade } = bg.key;
      const colorSet = palettes[palette];
      const newShade = (shade + shift) % colorSet.length;
      const newColor = colorSet[newShade];
      return { val: newColor, fn: input, key: { palette, shade: newShade } };
    }
  }
  return bg;
}

function SwapColors(input: IColorFunction, palettes: IPalettes, bg: IResolvedColor): IResolvedColor {
  if (input.p1 && typeof input.p1 === 'string' && input.p2 && typeof input.p2 === 'string') {
    const set1 = input.p1;
    const set2 = input.p2;
    if (bg.key) {
      let palette = bg.key.palette;
      if (palette === set1) {
        palette = set2;
      } else if (palette === set2) {
        palette = set1;
      }
      const newVal = palettes[palette][bg.key.shade];
      return { val: newVal, key: { palette, shade: bg.key.shade }, fn: input };
    }
  }
  return bg;
}