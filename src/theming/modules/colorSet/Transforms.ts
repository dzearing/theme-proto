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
  if (input.by) {
    const shift = input.by;
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
  if (input.swapTargets && input.swapTargets.length >= 2) {
    const targets = input.swapTargets;
    if (bg.key) {
      let palette = bg.key.palette;
      if (palette === targets[0]) {
        palette = targets[1];
      } else if (palette === targets[1]) {
        palette = targets[0];
      }
      const newVal = palettes[palette][bg.key.shade];
      return { val: newVal, key: { palette, shade: bg.key.shade }, fn: input };
    }
  }
  return bg;
}