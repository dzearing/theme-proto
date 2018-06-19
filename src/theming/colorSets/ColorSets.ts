import { IColorSetDefinitions, IColorSet, IResolvedColor } from "./IColorSet";
import { ISeedColors } from "../seedColors/ISeedColors";
import { resolveSeedColorDefinition } from "../seedColors/SeedColors";
import { IColor, getColorFromString } from "../../coloring/color";
import { IColorLayerKey } from "./IColorLayerKey";
import { getContrastRatio } from "../../coloring/shading";

const fallbackFg: IColor = { h: 0, s: 0, v: 0, a: 100, str: '#000000' };
const fallbackBg: IColor = { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' };
const fallbackSet: IColorSet = {
  fg: { val: fallbackFg },
  bg: { val: fallbackBg }
}
const bgType = 'bg';
const accentType = 'accent';

/**
 * 
 * @param obj The new theme or style that is being constructed.  Provided so that the seedColors can
 * be queried.
 * @param def Definition for this style, if specified should take precedence
 * @param parent the parent element in the inheritance chain.  If this is the default style and this is
 * specified it should be a parent theme
 */
export function resolveColorSetDefinition(
  obj: any,
  def?: Partial<IColorSetDefinitions>,
  parent?: IColorSet
): IColorSet {
  const seedKey = 'seedColors';
  const seedColors = obj.hasOwnProperty(seedKey) ?
    obj[seedKey] as ISeedColors :
    resolveSeedColorDefinition(obj);

  const result: IColorSet = Object.assign({}, fallbackSet, parent);
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
      if (entry.key) {
        entry.val = resolveColor(seedColors, entry.key, baseKey);
      }
    }
  }

  return result;
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