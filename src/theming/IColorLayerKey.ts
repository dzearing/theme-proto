export enum ColorLayerType {
  Background,
  Theme,
  Custom
}

export interface IColorLayerKey {
  type: ColorLayerType;
  shade: number;
  name?: string;
}
