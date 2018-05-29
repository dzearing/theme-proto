export enum ColorLayerType {
  Bg = 1,       // absolute reference to a background layer
  Accent = 2,   // absolute reference to a theme layer
  Switch = 3,   // absolute reference to flip layers
  Relative = 4,      // relative reference to same layer type
  SwitchRel = 5,  // relative reference to the switch layers
  Custom = 6      // custom color layer
}

export interface IColorLayerKey {
  type: ColorLayerType;
  shade: number;
  name?: string;
}
