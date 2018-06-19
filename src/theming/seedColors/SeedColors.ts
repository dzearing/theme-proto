import { ISeedColorDefinitions, ISeedColors } from "./ISeedColors";
import { getColorFromString, IColor } from "../../coloring/color";
import { getShadeArray } from "../../coloring/shading";

const fallbackFg: IColor = { h: 0, s: 0, v: 0, a: 100, str: '#000000' };
const fallbackBg: IColor = { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' };
const fallbackAccent: IColor = { h: 212.26, s: 100, v: 83.14, a: 100, str: '#0062d4' };
const minimumSeedColors: ISeedColors = { fg: [fallbackFg], bg: [fallbackBg], accent: [fallbackAccent] };

function convertColorArray(colors: string[], fallback: IColor): IColor[] {
  return colors.map((val) => (getColorFromString(val) || fallback));
}

export function resolveSeedColorDefinition(
  _obj: any,
  def?: Partial<ISeedColorDefinitions>,
  parent?: ISeedColors
): ISeedColors {
  if (def) {
    // start with the baseline from the bare minimum, then the parent if specified
    const result = Object.assign({}, minimumSeedColors, parent);

    // convert colors in the color definitions
    for (const key in def) {
      if (def.hasOwnProperty(key)) {
        const params = def[key];
        if (params) {
          if (typeof params.color === 'string') {
            const invertAt = params.invertAt || 50;
            const rotate: boolean = params.anchorColor || false;
            const count = 9;
            const low = 30;
            const high = 100;
            const seedColor = getColorFromString(params.color) || fallbackBg;
            result[key] = getShadeArray(seedColor, count, false, rotate, low, high, invertAt);
          } else {
            result[key] = convertColorArray(params.color, fallbackBg);
          }
        }
      }
    }

    // return the built up seed colors
    return result;
  } else if (parent) {
    // just pass on the parent without modification if no override definition is specified
    return parent;
  }
  // just return basic color arrays of length 1
  return Object.assign({}, minimumSeedColors);
}