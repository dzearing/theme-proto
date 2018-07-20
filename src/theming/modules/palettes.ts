import { colorFromString, IColor } from "../../coloring";
import { getLumAdjustedShadeArray } from "../../coloring/shading";
import { registerThemeModule } from "../core/ThemeModule";
import { IBaseLayer } from "../core/ICoreTypes";

/**
 * interface defining how an array of colors should be generated.  This either happens
 * via shading a single color or by specifying a full array of colors to use
 */
export interface IPaletteParams {
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

  /** strip out white and black from the array if true */
  tonalOnly?: boolean;
}

/** 
 * Theme colors, used to seed the theming system
 */
export interface IPaletteDefinitions {
  /**
   * Foreground is typically the text color
   */
  fg: IPaletteParams;
  /**
   * Default background color, typically a neutral color, this will be used to calculate the set
   * of layered background colors
   */
  bg: IPaletteParams;
  /**
   * Accent color for the theme.  Typically a brighter color, this is used to calculate the
   * themed or accented layers.
   */
  accent: IPaletteParams;
  /**
   * Additional color parameters can be appended to the set of definitions.  This will be
   * propogated through the system.
   */
  [key: string]: IPaletteParams;
}

/**
 * Resolved color arrays
 */
export interface IPalettes {
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

export const DefaultFgParams: IPaletteParams = { color: 'black' };

const fallbackBg: IColor = { str: '#ffffff', rgb: { r: 255, g: 255, b: 255, a: 100 } };

let palettesModuleName: string = 'palettes';

export function registerPalettesModule(keyName?: string) {
  if (keyName) {
    palettesModuleName = keyName;
  }
  registerThemeModule({
    name: palettesModuleName,
    default: {
      fg: DefaultFgParams,
      bg: { color: '#f3f2f1' },
      accent: { color: '#0078d4', anchorColor: true }
    },
    resolveDef: resolvePalettesDefinition
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
function resolvePalettesDefinition(
  name: string,
  _obj: any,
  defaultDef: IPaletteDefinitions,
  allowPartial: boolean,
  def?: Partial<IPaletteDefinitions>,
  parent?: IBaseLayer
): any {
  // state with nothing specified, just return nothing
  if (allowPartial && !def) {
    return undefined;
  }

  const parentPalettes = parent ? parent[name] : undefined;

  // default style with no definition, use the default
  if (!def && !parentPalettes) {
    def = defaultDef;
  }

  // if we have something to do then do conversions
  if (def) {
    // start with the baseline from the bare minimum, then the parent if specified
    const result = Object.assign({}, parentPalettes);

    // convert colors in the color definitions
    for (const key in def) {
      if (def.hasOwnProperty(key)) {
        const params = def[key];
        if (params) {
          addNamedPalette(result, key, params);
        }
      }
    }

    // return the built up palette
    return result;
  }

  return parentPalettes;
}

export function addNamedPalette(result: Partial<IPalettes>, key: string, params: IPaletteParams) {
  if (typeof params.color === 'string') {
    const { invertAt = 50, tonalOnly = false, anchorColor = false, color } = params;
    const count = 9;
    const seedColor = colorFromString(color) || fallbackBg;
    result[key] = getLumAdjustedShadeArray(seedColor, count, anchorColor, tonalOnly, invertAt);
  } else {
    result[key] = convertColorArray(params.color, fallbackBg);
  }
}

function convertColorArray(colors: string[], fallback: IColor): IColor[] {
  return colors.map((val) => (colorFromString(val) || fallback));
}
