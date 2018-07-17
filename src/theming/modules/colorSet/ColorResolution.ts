import { IRawStyle } from "@uifabric/styling";
import { IColorReference, IResolvedColor, IPaletteReference, IColorFunction, IColorSetDefinitions, IColorSet, IColorSetParams } from ".";
import { ExecuteTransform } from "./Transforms";
import { IColor, getColorFromString } from "../../../coloring/color";
import { registerPalettesModule, IPalettes } from "../palettes";
import { registerThemeModule } from "../../core/ThemeModule";
import { IBaseLayer } from "../../core/ICoreTypes";
import { AutoText } from "./AutoText";

const defaultBgKey: IPaletteReference = { palette: 'bg', shade: 0 };
const fallbackBg: IColor = { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' };

const bgType = 'bg';
const accentType = 'accent';

let colorSetModuleName: string = 'colorSet';
let palettesModuleName: string = 'seedColors';

export function registerColorSetModule(dependencyName: string, thisModuleName?: string) {
  palettesModuleName = dependencyName;
  if (thisModuleName) {
    colorSetModuleName = thisModuleName;
  }
  registerPalettesModule();
  registerThemeModule({
    name: colorSetModuleName,
    default: {
      backgroundColor: { type: 'bg', shade: 0 },
      color: { fn: 'autoText' }
    },
    dependsOn: [palettesModuleName],
    resolveDef: resolveColorSetDefinition,
    updateSettings: addColorsToSettings
  });
}

function colorFromPaletteReference(palettes: IPalettes, ref: IPaletteReference): IColor {
  if (palettes.hasOwnProperty(ref.palette)) {
    const palette = palettes[ref.palette];
    return palette[ref.shade % palette.length];
  }
  return palettes.bg[0];
}

function resolveColor(
  color: IColorReference,
  bg: IResolvedColor,
  palettes: IPalettes
): IResolvedColor {
  if (typeof color === 'string') {
    return { val: getColorFromString(color) || fallbackBg };
  } else if (color.hasOwnProperty('palette')) {
    const palRef = color as IPaletteReference;
    return { val: colorFromPaletteReference(palettes, palRef), key: palRef };
  } else if (color.hasOwnProperty('fn')) {
    const fnRef = color as IColorFunction;
    return ExecuteTransform(fnRef, palettes, bg);
  }
  return { val: bg.val };
}

function colorRefFromResolvedColor(resolved: IResolvedColor): IColorReference {
  if (resolved.fn) {
    return resolved.fn;
  } else if (resolved.key) {
    return resolved.key;
  }
  return resolved.val.str;
}

/**
 * 
 * @param obj The new theme or style that is being constructed.  Provided so that the seedColors can
 * be queried.
 * @param def Definition for this style, if specified should take precedence
 * @param parent the parent element in the inheritance chain.  If this is the default style and this is
 * specified it should be a parent theme
 */
function resolveColorSetDefinition(
  name: string,
  obj: any,
  defaultDef: IColorSetDefinitions,
  allowPartial: boolean,
  def?: Partial<IColorSetDefinitions>,
  parent?: IBaseLayer
): any {
  // a state with nothing overriden?  No values to report
  if (allowPartial && !def) {
    return undefined;
  }

  const parentSet: IColorSet | undefined = parent ? parent[name] : undefined;

  // try to get the seed colors
  const palettesKey = palettesModuleName;
  const palettes = (obj.hasOwnProperty(palettesKey) && obj[palettesKey]) ? obj[palettesKey] as IPalettes
    : parent![palettesKey!];

  // use the default definitions if totally empty
  if (!def && !parentSet) {
    def = defaultDef;
  }

  // reset the text color if background is specified on a state change
  if (allowPartial && def && def.backgroundColor && !def.color && parentSet) {
    def.color = colorRefFromResolvedColor(parentSet.color);
  }

  // aggregate information into results
  const result: any = (allowPartial) ?
    Object.assign({}, def) :
    Object.assign({}, parentSet, def);

  // only something to do if def is defined, otherwise just push the parent set through
  if (def) {
    let bgColor = parentSet ? parentSet.backgroundColor
      : { val: colorFromPaletteReference(palettes, defaultBgKey), key: defaultBgKey };
    let rerunTransforms: boolean = false;

    if (def.backgroundColor) {
      result.backgroundColor = resolveColor(def.backgroundColor, bgColor, palettes);
      rerunTransforms = true;
    }
    bgColor = result.backgroundColor;
    for (const key in result) {
      if (result.hasOwnProperty(key) && key !== 'backgroundColor') {
        if (def[key]) {
          result[key] = resolveColor(def[key]!, bgColor, palettes);
        } else {
          const thisColor: IResolvedColor = result[key];
          if (thisColor.fn && rerunTransforms) {
            result[key] = resolveColor(thisColor.fn, bgColor, palettes);
          } else if (thisColor.key) {
            result[key] = { ...result[key], val: colorFromPaletteReference(palettes, thisColor.key) };
          }
        }
      }
    }
  }

  return result;
}

function addColorsToSettings(settings: IRawStyle, colorSet: IColorSet, layer: IBaseLayer, params?: IColorSetParams): IRawStyle {
  for (const colorName in colorSet) {
    if (colorSet.hasOwnProperty(colorName)) {
      settings[colorName] = colorSet[colorName].val.str;
    }
  }
  if (params && params.textColor && layer[palettesModuleName]) {
    const palettes = layer[palettesModuleName] as IPalettes;
    const textFn: IColorFunction = { fn: 'autoText', textStyle: params.textColor };
    const result = AutoText(textFn, palettes, colorSet.backgroundColor);
    settings.color = result.val.str;
  }
  return settings;
}
