import { DefaultSeedColors, ISeedColorDefinitions, ISeedColors } from "./ISeedColors";
import { getColorFromString, IColor } from "../../../coloring/color";
import { getShadeArray } from "../../../coloring/shading";
import { mergeObjects } from "../../core/mergeObjects";
import { registerThemeModule } from "../ThemeModule";

const fallbackBg: IColor = { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' };

export const seedColorsPluginName: string = 'seedColors';

export function registerSeedColorsModule() {
  registerThemeModule({
    name: seedColorsPluginName,
    default: DefaultSeedColors,
    resolveDef: resolveSeedColorDefinition,
    stringConfig: parseSeedColorString
  });
}

/**
 * In the default style case we
 * @param _obj object being built, ignored
 * @param defaultDef definition to use if nothing is passed in
 * @param allowPartial whether a full or partial object should be returned
 * @param def partial definition to use
 * @param parent parent object
 */
export function resolveSeedColorDefinition(
  _obj: any,
  defaultDef: ISeedColorDefinitions,
  allowPartial: boolean,
  def?: Partial<ISeedColorDefinitions>,
  parent?: ISeedColors
): any {
  // state with nothing specified, just return nothing
  if (allowPartial && !def) {
    return undefined;
  }

  // default style with no definition, use the default
  if (!def && !parent) {
    def = defaultDef;
  }

  // if we have something to do then do conversions
  if (def) {
    // start with the baseline from the bare minimum, then the parent if specified
    const result = Object.assign({}, parent);

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
  }

  return parent;
}

function convertColorArray(colors: string[], fallback: IColor): IColor[] {
  return colors.map((val) => (getColorFromString(val) || fallback));
}

function parseSeedColorString(
  _theme: object,
  definition: object,
  term: string,
  param?: string
): number {
  if (param && (term === 'fg:' || term === 'bg:' || term === 'accent:')) {
    const newSeedColors = {};
    newSeedColors[term.slice(0, -1)] = param;
    const newDef = {};
    newDef[seedColorsPluginName] = newSeedColors;
    mergeObjects(definition, newDef);
    return 2;
  }
  return 0;
}