import { IColor } from "../coloring/color";
import { IColorLayerKey } from "./IColorLayerKey";

/*
    A given color layer.  This contains the core colors, optional colors calculated for controls
    as well as references to alternate state values for this layer.  Also created on demand.
*/
export interface IColorLayer {
  // color values, created on demand
  key: IColorLayerKey;
  clr: { 
    fg: IColor;
    bg: IColor;
    [key: string]: IColor;
  };
  ref: {
    [key: string]: IColorLayer;
  }
}

export interface IColorDefinition {
  [key: string]: { fn: string, param?: number|string };
}