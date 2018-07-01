import { IRawStyle } from "@uifabric/styling";

export interface IBaseState {
  props?: IRawStyle;
  // other theme modules will be in here as well
  // seedColors:
  // colors:
  // typography:
}

export interface IBaseStyle extends IBaseState {
  parent?: string;
  states?: { [key: string]: IBaseState };
}

export type ThemeResolver = () => IBaseStyle;

export interface IBaseTheme extends IBaseStyle {
  definition?: any;
  styles?: {
    [key: string]: IBaseStyle | ThemeResolver;
  }
}

export type IBaseStateDefinition = IBaseState;
export type IBaseStyleDefinition = IBaseStyle;
export type IBaseThemeDefinition = IBaseTheme;

export interface IStyleRequestProps {
  name?: string;
  modules?: { [key: string]: object };
}