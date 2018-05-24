import { IDefaultLayers, ITransformParameters } from "./IThemeDefinition";

/*
  These are user settings that can be changed on a theme, either globally or on a per-layer basis
*/
export interface IThemeInputs {
  // overall theme name to get a package
  themeStyle?: string;

  // colors
  fg?: string;
  bg?: string;
  accent?: string;

  // treatments
  invert?: boolean;
  highContrast?: boolean;

  // alternate layer defaults
  defaultLayers?: IDefaultLayers;

  // alternate transforms
  transforms?: ITransformParameters;
}