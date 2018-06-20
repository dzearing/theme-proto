import { IColor } from "../../../coloring/color";

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

/*
  Key for indexing and referring to colors and layers.
  type: should be one of:
    bg|accent|fg  - index into the layers for backgrounds, themed colors, and fg colors
    switch        - given a base key, switch from bg to accent or vice versa
    rel           - given a base key, adjust the shade value by the amount specified
    relswitch     - combine switch and rel functionality
    fn            - use a function to calculate the value.  In this case name is the function
                    name and shade is an optional parameter
  shade: which color shade numerically is being referenced
  name: specified for custom layers, if valid it is assumed to be custom
*/
export interface IColorLayerKey {
  type: string;
  shade: number;
  name?: string;
}

export const DefaultColorSet: IColorSetDefinitions = {
  bg: { type: 'bg', shade: 0 },
  fg: { type: 'fn', shade: 0, name: 'autofg' }
}
