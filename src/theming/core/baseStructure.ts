import { IRawStyle } from "@uifabric/styling";

export interface IBaseState {
  props?: IRawStyle;
  // other theme modules will be in here as well
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

export const baseStructure = {
  parent: 'default',
  props: {},
  states: {},
  definition: {},
  styles: {}
}