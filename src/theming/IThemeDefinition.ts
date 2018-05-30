import { IColorLayerKey, ColorLayerType } from "./IColorLayerKey";

export interface IThemeOffsets {
  default: IColorLayerKey;
  shadedControl: IColorLayerKey;
  themedControl: IColorLayerKey;
  hovered: IColorLayerKey;
  pressed: IColorLayerKey;
}

export const defaultThemeOffsets: IThemeOffsets = {
  default: { type: ColorLayerType.Bg, shade: 0 },
  shadedControl: { type: ColorLayerType.Relative, shade: 3 },
  themedControl: { type: ColorLayerType.Switch, shade: 0 },
  hovered: { type: ColorLayerType.Relative, shade: 2 },
  pressed: { type: ColorLayerType.Relative, shade: 3 }
}