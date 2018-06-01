import { IColorLayerKey } from "./IColorLayerKey";

export interface IThemeOffsets {
  default: IColorLayerKey;
  shadedControl: IColorLayerKey;
  themedControl: IColorLayerKey;
  hovered: IColorLayerKey;
  pressed: IColorLayerKey;
}

export const defaultThemeOffsets: IThemeOffsets = {
  default: { type: 'bg', shade: 0 },
  shadedControl: { type: 'rel', shade: 3 },
  themedControl: { type: 'switch', shade: 0 },
  hovered: { type: 'rel', shade: 2 },
  pressed: { type: 'rel', shade: 3 }
}