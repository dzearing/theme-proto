import { IColor } from "../coloring/color";

/*
    A given color layer.  This contains the core colors, optional colors calculated for controls
    as well as references to alternate state values for this layer.  Also created on demand.
*/
export interface IColorLayer {
  // color values, created on demand
  fg: IColor;
  bg: IColor;
  named: { [key: string]: IColor };

  // references to alternate state layers, created or linked on request
  hovered?: IColorLayer;
  pressed?: IColorLayer;
  selected?: IColorLayer;
  disabled?: IColorLayer;
}

/*
  Values that need to be ensured for a given layer.  Pulled on-demand.
*/
export interface IRequiredLayerValues {
  // named color values 
  names?: string[];

  // recursive references to other layers, which will also require the same named values
  hovered?: boolean;
  pressed?: boolean;
  selected?: boolean;
  disabled?: boolean;
}