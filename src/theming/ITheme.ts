import { IColorPalette, createColorPalette } from "./IColorPalette";
import { IColor, getColorFromString } from "../coloring/color";

export interface IPalette {
  themeDarker: string;
  themeDark: string;
  themeDarkAlt: string;
  themePrimary: string;
  themeSecondary: string;
  themeTertiary: string;
  themeLight: string;
  themeLighter: string;
  themeLighterAlt: string;
  black: string;
  blackTranslucent40: string;
  neutralDark: string;
  neutralPrimary: string;
  neutralPrimaryAlt: string;
  neutralSecondary: string;
  neutralTertiary: string;
  neutralTertiaryAlt: string;
  neutralQuaternary: string;
  neutralQuaternaryAlt: string;
  neutralLight: string;
  neutralLighter: string;
  neutralLighterAlt: string;
  accent: string;
  white: string;
  whiteTranslucent40: string;
  yellow: string;
  yellowLight: string;
  orange: string;
  orangeLight: string;
  orangeLighter: string;
  redDark: string;
  red: string;
  magentaDark: string;
  magenta: string;
  magentaLight: string;
  purpleDark: string;
  purple: string;
  purpleLight: string;
  blueDark: string;
  blueMid: string;
  blue: string;
  blueLight: string;
  tealDark: string;
  teal: string;
  tealLight: string;
  greenDark: string;
  green: string;
  greenLight: string;
}

export type IPaletteReference = keyof IPalette;

export interface IPaletteSet {
  background: IPaletteReference;
  text: IPaletteReference;
  link: IPaletteReference;
  linkVisited: IPaletteReference;
}

/*
  inputs to the theming system, specified in the provider
*/
export interface IThemeSettings {
  fg: string;
  bg: string;
  accent: string;
  name?: string;

  palette: IPalette;
  paletteSets: { [key: string]: IPaletteSet };
}

/*
  resolved theme values, provided to the consumer
*/
export interface ITheme {
  paletteSets: { [key: string]: IPaletteSet };

  colors: IColorPalette;
}

export interface IThemeRef {
  ref: ITheme;
}

export function createLayeredTheme(settings: Partial<IThemeSettings>, parent: ITheme): ITheme {
  const newTheme = { };

  // if any of the core colors have changed update the color cache
  if (settings.fg || settings.bg || settings.accent) {
    const propToAdd: string = 'colors';
    const oldColors: IColorPalette = parent.colors;
    const fg: IColor = settings.fg ? (getColorFromString(settings.fg) || oldColors.fg) : oldColors.fg;
    const bg: IColor = settings.bg ? (getColorFromString(settings.bg) || oldColors.bg) : oldColors.bg;
    const accent: IColor = settings.accent ? (getColorFromString(settings.accent) || oldColors.theme) : oldColors.theme;
    newTheme[propToAdd] = createColorPalette(fg, bg, accent);
  }

  return Object.assign({}, parent, newTheme);
}