import { getColorFromString, IColor } from "../../coloring/color";
import { getShadeArray } from "../../coloring/shading";
import { registerThemeModule } from "../core/ThemeModule";
import { IBaseLayer } from "../core/ICoreTypes";

/**
 * interface defining how an array of colors should be generated.  This either happens
 * via shading a single seed color or by specifying a full array of colors to use
 */
export interface ISeedColorParams {
  /**
   * Either a single color, or an array of color strings.  If it is a single
   * color that color is used to generate a swatch array using the specified color
   * as the tone of that color
   */
  color: string | string[];
  /**
   * Value between 0 to 100 for inverting the colors.  For an array of tones they will go
   * from lightest (100 luminance) to darkest (0 luminance).  An inverted array will go
   * in reverse order.  The check will be if color.l < invertAt then reverse.  So if 50
   * is the crossover, if the luminance is < 50 (so darker) then invert.
   */
  invertAt?: number;
  /**
   * If a seed color is an intermediate value (not dark or light) it will be in the middle
   * of the range of tones.  If anchroColor is specified the array will be rotated to place
   * the specified color into index 0
   */
  anchorColor?: boolean;
}

/** 
 * Theme colors, used to seed the theming system
 */
export interface ISeedColorDefinitions {
  /**
   * Foreground is typically the text color
   */
  fg: ISeedColorParams;
  /**
   * Default background color, typically a neutral color, this will be used to calculate the set
   * of layered background colors
   */
  bg: ISeedColorParams;
  /**
   * Accent color for the theme.  Typically a brighter color, this is used to calculate the
   * themed or accented layers.
   */
  accent: ISeedColorParams;
  /**
   * Additional color parameters can be appended to the set of definitions.  This will be
   * propogated through the system.
   */
  [key: string]: ISeedColorParams;
}

/**
 * Resolved color arrays
 */
export interface ISeedColors {
  /**
   * Background color layers.  Generated from the seed colors unless specified
   */
  bg: IColor[];
  /**
   * Accent color layers.  Generated from the accent seed color unless specified directly
   */
  accent: IColor[];
  /**
   * Foreground color layers.  Generated from foreground and cached to save on contrast calculations
   */
  fg: IColor[];
  /**
   * Additional layers.  If an additional swatch array is specified, an additional set of
   * layers will be created to match that can then be referenced by name and index.
   */
  [key: string]: IColor[];
}



const fallbackBg: IColor = { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' };

let seedColorsPluginName: string = 'seedColors';

export function registerSeedColorsModule(keyName?: string) {
  if (keyName) {
    seedColorsPluginName = keyName;
  }
  registerThemeModule({
    name: seedColorsPluginName,
    default: {
      fg: { color: 'black' },
      bg: { color: '#f3f2f1' },
      accent: { color: '#0078d4', anchorColor: true }
    },
    resolveDef: resolveSeedColorDefinition
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
function resolveSeedColorDefinition(
  name: string,
  _obj: any,
  defaultDef: ISeedColorDefinitions,
  allowPartial: boolean,
  def?: Partial<ISeedColorDefinitions>,
  parent?: IBaseLayer
): any {
  // state with nothing specified, just return nothing
  if (allowPartial && !def) {
    return undefined;
  }

  const parentSeeds = parent ? parent[name] : undefined;

  // default style with no definition, use the default
  if (!def && !parentSeeds) {
    def = defaultDef;
  }

  // if we have something to do then do conversions
  if (def) {
    // start with the baseline from the bare minimum, then the parent if specified
    const result = Object.assign({}, parentSeeds);

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

  return parentSeeds;
}

function convertColorArray(colors: string[], fallback: IColor): IColor[] {
  return colors.map((val) => (getColorFromString(val) || fallback));
}
