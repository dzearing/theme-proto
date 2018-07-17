import { IColorFunction, IResolvedColor, IColorTransforms } from '.';
import { IPalettes } from '../palettes';
import { AutoText } from './AutoText';

export function ExecuteTransform(input: IColorFunction, palettes: IPalettes, bg: IResolvedColor): IResolvedColor {
  if (ColorTransforms.hasOwnProperty(input.fn)) {
    return ColorTransforms[input.fn](input, palettes, bg);
  }
  return ColorTransforms.autoText(input, palettes, bg);
}

const ColorTransforms: IColorTransforms = {
  autoText: AutoText,
  deepen: DeepenColor,
  swap: SwapColors
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