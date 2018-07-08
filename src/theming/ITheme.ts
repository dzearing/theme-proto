import { ITypography } from "./ITypography";

export type ISwatch = string;

export interface ISwatches {
  themeDarker: ISwatch;
  themeDark: ISwatch;
  themeDarkAlt: ISwatch;
  themePrimary: ISwatch;
  themeSecondary: ISwatch;
  themeTertiary: ISwatch;
  themeLight: ISwatch;
  themeLighter: ISwatch;
  themeLighterAlt: ISwatch;
  black: ISwatch;
  blackTranslucent40: ISwatch;
  neutralDark: ISwatch;
  neutralPrimary: ISwatch;
  neutralPrimaryAlt: ISwatch;
  neutralSecondary: ISwatch;
  neutralTertiary: ISwatch;
  neutralTertiaryAlt: ISwatch;
  neutralQuaternary: ISwatch;
  neutralQuaternaryAlt: ISwatch;
  neutralLight: ISwatch;
  neutralLighter: ISwatch;
  neutralLighterAlt: ISwatch;
  accent: ISwatch;
  white: ISwatch;
  whiteTranslucent40: ISwatch;
  yellow: ISwatch;
  yellowLight: ISwatch;
  orange: ISwatch;
  orangeLight: ISwatch;
  orangeLighter: ISwatch;
  redDark: ISwatch;
  red: ISwatch;
  magentaDark: ISwatch;
  magenta: ISwatch;
  magentaLight: ISwatch;
  purpleDark: ISwatch;
  purple: ISwatch;
  purpleLight: ISwatch;
  blueDark: ISwatch;
  blueMid: ISwatch;
  blue: ISwatch;
  blueLight: ISwatch;
  tealDark: ISwatch;
  teal: ISwatch;
  tealLight: ISwatch;
  greenDark: ISwatch;
  green: ISwatch;
  greenLight: ISwatch;
}

export type ISwatchRef = keyof ISwatches;

export interface IScheme {
  /** Primative color values */
  background: ISwatchRef;
  hoverBackground: ISwatchRef;
  activeBackground: ISwatchRef;
  disabledBackground: ISwatchRef;

  text: ISwatchRef;
  hoverText: ISwatchRef;
  activeText: ISwatchRef;
  disabledText: ISwatchRef;

  icon: ISwatchRef;

  link: ISwatchRef;
  linkVisited: ISwatchRef;

  // defaultStyle: IStyle;
  // hoveredStyle: IStyle;
  // pressedStyle: IStyle;
  // selectedStyle: IStyle;
}

export interface IPartialScheme extends Partial<IScheme> {
  extends?: string;
}

export interface ISchemes {
  [key: string]: IScheme;
}

export interface IPartialSchemes {
  [key: string]: IPartialScheme;
}

export interface IPartialTheme {
  swatches: Partial<ISwatches>;
  schemes: IPartialSchemes;
  typography: Partial<ITypography>;
}

export interface ITheme {
  swatches: ISwatches;
  schemes: ISchemes;
  typography: ITypography;
}
