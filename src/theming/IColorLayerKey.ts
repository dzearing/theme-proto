/*
  Key for indexing and referring to colors and layers.
  type: should be one of:
    bg|accent     - index into the layers for backgrounds and themed colors
    switch        - given a base key, switch from bg to accent or vice versa
    rel           - given a base key, adjust the shade value by the amount specified
    relswitch     - combine switch and rel functionality
  shade: which color shade numerically is being referenced
  name: specified for custom layers, if valid it is assumed to be custom
*/
export interface IColorLayerKey {
  type: string;
  shade: number;
  name?: string;
}

const bgType: string = 'bg';
const accentType: string = 'accent';

export function flipType(type: string): string {
  return (type === accentType) ? bgType : accentType;
}

export function resolveKey(key: IColorLayerKey, base?: IColorLayerKey): IColorLayerKey {
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

export function isIndexKey(key: IColorLayerKey): boolean {
  return key.type === bgType || key.type === accentType;
}