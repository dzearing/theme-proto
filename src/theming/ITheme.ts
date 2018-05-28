import { IColorPalette, createColorPalette } from "./IColorPalette";
import { IColor, getColorFromString } from "../coloring/color";
import { IThemeOffsets } from "./IThemeDefinition";
import { ColorLayerType } from "./IColorLayerKey";

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
  Seed colors, used to calculate the scheme for the theme
*/
export interface IThemeColors {
  fg: string;
  bg: string;
  accent: string;
}

/*
  Theme definition, used to specify or modify the theme
*/
export interface IThemeSettings {
  seedColors: IThemeColors;
  offsets: IThemeOffsets;
  palette: IPalette;
  paletteSets: { [key: string]: IPaletteSet };
}

/*
  Theme definition, used to create a custom theme or theme variation
*/
export interface IThemeDefinition {
  parent?: string;
  changes?: string;
  settings: Partial<IThemeSettings>;
}

/*
  Full theme, contains both the inputs and calculated/generated values
*/
export interface ITheme extends IThemeSettings {
  colors: IColorPalette;
}

/*
  resolved theme values, provided to the consumer
*/
export interface ITheme2 {
  paletteSets: { [key: string]: IPaletteSet };

  offsets: IThemeOffsets;
  colors: IColorPalette;
}

export function createLayeredTheme(definition: IThemeDefinition): ITheme {
  const newTheme = { };
  const changes = definition.changes;

  if (changes) {
    const updatedSettings = themeFromUpdateString(settings.change, parent);
    if (updatedSettings) {
      settings = Object.assign({}, settings, themeFromUpdateString(settings.change, parent));
    }
  }

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
