export type IColor = string;

export interface IPalette {
  themeDarker: IColor;
  themeDark: IColor;
  themeDarkAlt: IColor;
  themePrimary: IColor;
  themeSecondary: IColor;
  themeTertiary: IColor;
  themeLight: IColor;
  themeLighter: IColor;
  themeLighterAlt: IColor;
  black: IColor;
  blackTranslucent40: IColor;
  neutralDark: IColor;
  neutralPrimary: IColor;
  neutralPrimaryAlt: IColor;
  neutralSecondary: IColor;
  neutralTertiary: IColor;
  neutralTertiaryAlt: IColor;
  neutralQuaternary: IColor;
  neutralQuaternaryAlt: IColor;
  neutralLight: IColor;
  neutralLighter: IColor;
  neutralLighterAlt: IColor;
  accent: IColor;
  white: IColor;
  whiteTranslucent40: IColor;
  yellow: IColor;
  yellowLight: IColor;
  orange: IColor;
  orangeLight: IColor;
  orangeLighter: IColor;
  redDark: IColor;
  red: IColor;
  magentaDark: IColor;
  magenta: IColor;
  magentaLight: IColor;
  purpleDark: IColor;
  purple: IColor;
  purpleLight: IColor;
  blueDark: IColor;
  blueMid: IColor;
  blue: IColor;
  blueLight: IColor;
  tealDark: IColor;
  teal: IColor;
  tealLight: IColor;
  greenDark: IColor;
  green: IColor;
  greenLight: IColor;
}

export type IPaletteReference = keyof IPalette;

export interface IPaletteSet {
  background: IPaletteReference;
  text: IPaletteReference;
  link: IPaletteReference;
  linkVisited: IPaletteReference;
}

export interface ITheme {
  palette: IPalette;
  paletteSets: { [key: string]: IPaletteSet };
}
