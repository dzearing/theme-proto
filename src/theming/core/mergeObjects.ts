import { IBaseThemeDef, IBaseLayerDef } from "./ICoreTypes";

/**
 * This will take two objects returning a new recursively merged object as a result.
 * @param a object to apply first
 * @param b object to apply on top of object a
 */
export function mergeObjects(a: any, b: any): any {
  const result = { ...a };
  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      const bval = b[key];
      if (typeof bval === 'object'
        && result.hasOwnProperty(key)
        && typeof result[key] === 'object'
      ) {
        result[key] = mergeObjects(result[key], bval);
      } else {
        result[key] = bval;
      }
    }
  }
  return result;
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
        if (!result.hasOwnProperty(key) || typeof result[key] !== 'object' || typeof b[key] !== 'object') {
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

export function mergeDefinitions<IDefinition extends IBaseLayerDef>(
  a: Partial<IDefinition> | undefined,
  b: Partial<IDefinition> | undefined
): Partial<IDefinition> {
  return mergeLayers(a, b, true) as IDefinition;
}