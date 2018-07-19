import { IBaseLayerDef } from "./ICoreTypes";

function _isNotObject(val: any): boolean {
  return (typeof val !== 'object' || Array.isArray(val));
}

function mergeLayers(
  a: Partial<IBaseLayerDef> | undefined,
  b: Partial<IBaseLayerDef> | undefined,
  assignKids: boolean
): Partial<IBaseLayerDef> {
  const result = Object.assign({}, a);
  if (b) {
    for (const key in b) {
      if (b.hasOwnProperty(key)) {
        if (!result.hasOwnProperty(key) || _isNotObject(result[key]) || _isNotObject(b[key])) {
          result[key] = b[key];
        } else {
          // in this case both a and b have the property and both are objects
          if (!assignKids || key === 'states' || key === 'layers') {
            result[key] = mergeLayers(result[key], b[key], !assignKids);
          } else {
            result[key] = Object.assign({}, result[key], b[key]);
          }
        }
      }
    }
  }
  return result;
}

/**
 * Take two definitions and merge them recursively.  Properties within modules or within settings will be
 * assigned, the overall structure will be merged though.
 * @param a definition to use as the baseline
 * @param b definition to merge/assign on top of a
 */
export function mergeDefinitions<IDefinition extends IBaseLayerDef>(
  a: Partial<IDefinition> | undefined,
  b: Partial<IDefinition> | undefined
): Partial<IDefinition> {
  return mergeLayers(a, b, true) as IDefinition;
}