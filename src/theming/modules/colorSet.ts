import { IRawStyle } from "@uifabric/styling";
import { IColor, getColorFromString } from "../../coloring/color";
import { registerSeedColorsModule } from "./seedColors";
import { registerThemeModule } from "../core/ThemeModule";
import { IBaseStyle } from "../core/ICoreTypes";
import { ISeedColors } from "./seedColors";
import { getContrastRatio } from "../../coloring/shading";
import { mergeObjects } from "../core/mergeObjects";

const fallbackFg: IColor = { h: 0, s: 0, v: 0, a: 100, str: '#000000' };
const fallbackBg: IColor = { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' };
const fallbackSet: IColorSet = {
  color: { val: fallbackFg },
  backgroundColor: { val: fallbackBg }
}
const bgType = 'bg';
const accentType = 'accent';

let colorsPluginName: string = 'colorSet';
let seedColorsPluginName: string = 'seedColors';

export type IColorReference = string | IColorLayerKey;

export interface IColorSetDefinitions {
  color: IColorReference;
  backgroundColor: IColorReference;
  [key: string]: IColorReference;
}

export interface IResolvedColor {
  val: IColor;
  key?: IColorLayerKey;
}

export interface IColorSet {
  color: IResolvedColor;
  backgroundColor: IResolvedColor;
  [key: string]: IResolvedColor;
}

/*
  Key for indexing and referring to colors and layers.
  type: should be one of:
    bg|accent|fg  - index into the layers for backgrounds, themed colors, and fg colors
    switch        - given a base key, switch from bg to accent or vice versa
    rel           - given a base key, adjust the shade value by the amount specified
    relswitch     - combine switch and rel functionality
    fn            - use a function to calculate the value.  In this case name is the function
                    name and shade is an optional parameter
  shade: which color shade numerically is being referenced
  name: specified for custom layers, if valid it is assumed to be custom
*/
export interface IColorLayerKey {
  type: string;
  shade: number;
  name?: string;
}

export function registerColorSetModule(dependencyName: string, thisModuleName?: string) {
  seedColorsPluginName = dependencyName;
  if (thisModuleName) {
    colorsPluginName = thisModuleName;
  }
  registerSeedColorsModule();
  registerThemeModule({
    name: colorsPluginName,
    default: {
      backgroundColor: { type: 'bg', shade: 0 },
      color: { type: 'fn', shade: 0, name: 'autofg' },
    },
    dependsOn: [seedColorsPluginName],
    resolveDef: resolveColorSetDefinition,
    updateStyle: addColorsToStyle,
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
  name: string,
  obj: any,
  defaultDef: IColorSetDefinitions,
  allowPartial: boolean,
  def?: Partial<IColorSetDefinitions>,
  parent?: IBaseStyle
): any {
  // a state with nothing overriden?  No values to report
  if (allowPartial && !def) {
    return undefined;
  }

  const parentSet = parent ? parent[name] : undefined;

  // try to get the seed colors
  const seedKey = seedColorsPluginName;
  const seedColors = (obj.hasOwnProperty(seedKey) && obj[seedKey]) ? obj[seedKey] as ISeedColors
    : (parent && parent.hasOwnProperty(seedKey)) ?
      parent[seedKey] as ISeedColors : undefined;

  // use the default definitions if totally empty
  if (!def && !parentSet) {
    def = defaultDef;
  }

  const result = (allowPartial) ? {} : Object.assign({}, fallbackSet, parentSet);
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
  const baseKey = (parentSet) ? parentSet.backgroundColor.key : undefined;
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const entry = result[key];
      if (entry.key && seedColors) {
        const entryVals = resolveColor(seedColors, entry.key, baseKey);
        entry.val = entryVals.val;
        entry.key = entryVals.key;
      }
    }
  }

  return result;
}

function addColorsToStyle(style: IRawStyle, colorSet: IColorSet, _params?: object): IRawStyle {
  for (const colorName in colorSet) {
    if (colorSet.hasOwnProperty(colorName)) {
      style[colorName] = colorSet[colorName].val.str;
    }
  }
  return style;
}

function resolveColor(layers: ISeedColors, key: IColorLayerKey, base?: IColorLayerKey): IResolvedColor {
  // make sure the key is converted to a non-relative key
  key = resolveKey(key, base);

  // now look up the layer if the type is an index into the layers
  if (layers.hasOwnProperty(key.type)) {
    const colors = layers[key.type];
    return { val: colors[key.shade % colors.length], key };
  }
  const fallbackKey: IColorLayerKey = { type: bgType, shade: 0 };

  if (isFnKey(key) && key.name) {
    if (key.name === 'autofg') {
      const bgVal = resolveColor(layers, base || fallbackKey);
      return { val: getAutoFg(layers, bgVal.val), key };
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
    const colorsDefinition: IColorSetDefinitions = definition[colorsPluginName];

    let bgKey: IColorLayerKey = { type: 'bg', shade: 0 };
    if (colorsDefinition && colorsDefinition.backgroundColor && typeof colorsDefinition.backgroundColor !== 'string') {
      bgKey = colorsDefinition.backgroundColor;
    } else if (baseColors.backgroundColor.key) {
      bgKey = { ...baseColors.backgroundColor.key };
    }

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
    definition[colorsPluginName] = mergeObjects(colorsDefinition, { backgroundColor: bgKey });
    return 2;
  }
  return 0;
}