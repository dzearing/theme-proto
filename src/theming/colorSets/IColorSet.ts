import { IColorLayerKey } from "./IColorLayerKey";
import { IColor } from "../../coloring/color";

export type IColorReference = string | IColorLayerKey;

export interface IColorSetDefinitions {
  fg: IColorReference;
  bg: IColorReference;
  [key: string]: IColorReference;
}

export interface IResolvedColor {
  val: IColor;
  key?: IColorLayerKey;
}

export interface IColorSet {
  fg: IResolvedColor;
  bg: IResolvedColor;
  [key: string]: IResolvedColor;
}
