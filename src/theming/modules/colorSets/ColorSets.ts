import {
  DefaultColorSet,
  IColorSetDefinitions,
  IColorSet,
  IResolvedColor,
  IColorLayerKey
} from "./IColorSet";
import { ISeedColors } from "../seedColors/ISeedColors";
import { seedColorsPluginName, registerSeedColorsModule } from "../seedColors/SeedColors";
import { IColor, getColorFromString } from "../../../coloring/color";
import { getContrastRatio } from "../../../coloring/shading";
import { mergeObjects } from "../../core/mergeObjects";
import { registerThemeModule } from "../ThemeModule";

const fallbackFg: IColor = { h: 0, s: 0, v: 0, a: 100, str: '#000000' };
const fallbackBg: IColor = { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' };
const fallbackSet: IColorSet = {
  fg: { val: fallbackFg },
  bg: { val: fallbackBg }
}
const bgType = 'bg';
const accentType = 'accent';

export const colorsPluginName: string = 'colors';

export function registerColorSetModule() {
  registerSeedColorsModule();
  registerThemeModule({
    name: colorsPluginName,
    default: DefaultColorSet,
    dependsOn: [seedColorsPluginName],
    resolveDef: resolveColorSetDefinition,
    resolveValue: resolveColorValue,
    stringConfig: parseColorsString
  });
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
  obj: any,
  defaultDef: IColorSetDefinitions,
  allowPartial: boolean,
  def?: Partial<IColorSetDefinitions>,
  parent?: IColorSet
): any {
  // a state with nothing overriden?  No values to report
  if (allowPartial && !def) {
    return undefined;
  }

  // try to get the seed colors
  const seedKey = seedColorsPluginName;
  const seedColors = obj.hasOwnProperty(seedKey) ? obj[seedKey] as ISeedColors : undefined;

  // use the default definitions if totally empty
  if (!def && !parent) {
    def = defaultDef;
  }

  const result = (allowPartial) ? {} : Object.assign({}, fallbackSet, parent);
  if (def) {
    for (const key in def) {
      if (def.hasOwnProperty(key)) {
        const colorRef = def[key];
        if (colorRef) {
          const newEntry: IResolvedColor = typeof colorRef === 'string' ?
            { val: getColorFromString(colorRef) || fallbackBg }
            : { val: fallbackBg, key: colorRef };
          result[key] = newEntry;
        }
      }
    }
  }

  // now iterate through the result values and resolve any ones specified by key
  const baseKey = (parent && parent.bg.key) ? parent.bg.key : undefined;
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const entry = result[key];
      if (entry.key && seedColors) {
        entry.val = resolveColor(seedColors, entry.key, baseKey);
      }
    }
  }

  return result;
}

function resolveColorValue(value: IResolvedColor, _modifier?: string): string {
  return value.val.str;
}

function resolveColor(layers: ISeedColors, key: IColorLayerKey, base?: IColorLayerKey): IColor {
  // make sure the key is converted to a non-relative key
  key = resolveKey(key, base);

  // now look up the layer if the type is an index into the layers
  if (layers.hasOwnProperty(key.type)) {
    const colors = layers[key.type];
    return colors[key.shade % colors.length];
  }
  const fallbackKey: IColorLayerKey = { type: bgType, shade: 0 };

  if (isFnKey(key) && key.name) {
    if (key.name === 'autofg') {
      return getAutoFg(layers, resolveColor(layers, base || fallbackKey));
    }
  }

  return resolveColor(layers, fallbackKey);
}

function flipType(type: string): string {
  return (type === accentType) ? bgType : accentType;
}

function resolveKey(key: IColorLayerKey, base?: IColorLayerKey): IColorLayerKey {
  const { type, shade } = key;
  const baseType = base ? base.type : bgType;
  const baseShade = base ? base.shade : 0;
  switch (type) {
    case 'switch':
      return { type: flipType(baseType), shade };
    case 'rel':
      return { type: baseType, shade: shade + baseShade };
    case 'relswitch':
      return { type: flipType(baseType), shade: shade + baseShade };
  }
  return key;
}

function getAutoFg(layers: ISeedColors, bgColor: IColor): IColor {
  const fgs = layers.fg;
  let bestIndex = 0;
  let bestRatio: number = getContrastRatio(bgColor, fgs[bestIndex]);
  for (let i = 1; i < fgs.length; i++) {
    const newRatio: number = getContrastRatio(bgColor, fgs[i]);
    if (newRatio > bestRatio) {
      bestRatio = newRatio;
      bestIndex = i;
    }
  }
  return fgs[bestIndex];
}

function isFnKey(key: IColorLayerKey): boolean {
  return key.type === 'fn' && key.name !== undefined;
}

function parseColorsString(
  theme: object,
  definition: object,
  term: string,
  param?: string
): number {
  if (param
    && theme.hasOwnProperty(colorsPluginName)
    && (term === 'type:' || term === 'deepen:' || term === 'shade:')
  ) {
    const baseColors = theme[colorsPluginName] as IColorSet;
    const bgKey: IColorLayerKey = baseColors.bg.key || { type: 'bg', shade: 0 };
    if (term === 'type:') {
      if (param === 'switch') {
        bgKey.type = flipType(bgKey.type);
      } else {
        bgKey.type = param;
      }
    } else {
      const shade: number = parseInt(param, 10);
      if (isNaN(shade)) {
        return 0;
      }
      bgKey.shade = (term === 'deepen:') ? bgKey.shade + shade : shade;
    }
    const defToAdd = {};
    defToAdd[colorsPluginName] = { bg: bgKey };
    definition = mergeObjects(definition, defToAdd);
    return 2;
  }
  return 0;
}