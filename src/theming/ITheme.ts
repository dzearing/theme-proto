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
  parent: string;
  settings: Partial<IThemeSettings>;
}

/*
  Full theme, contains both the inputs and calculated/generated values
*/
export interface ITheme extends IThemeDefinition {
  colors: IColorPalette;
}

/*
  inputs to the theming system, specified in the provider
*/
export interface IThemeSettings2 {
  fg: string;
  bg: string;
  accent: string;
  name?: string;

  change?: string;
  offsets?: IThemeOffsets;

  palette: IPalette;
  paletteSets: { [key: string]: IPaletteSet };
}

/*
  resolved theme values, provided to the consumer
*/
export interface ITheme2 {
  paletteSets: { [key: string]: IPaletteSet };

  offsets: IThemeOffsets;
  colors: IColorPalette;
}

export function createLayeredTheme(settings: Partial<IThemeSettings>, parent: ITheme): ITheme {
  const newTheme = { };

  if (settings.change) {
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

/*
  generate a theme settings interface from an update string.  Possible options:
    type: [theme|bg|switch]             - adjust the type of the default layer as specified
    deepen: number                      - adjust the current shade by the specified number of levels
    shade: number                       - set the current shade to the specified value
*/
export function themeFromUpdateString(update: string, theme: ITheme): Partial<IThemeSettings>|undefined {
  const terms = update.split(' ');
  const offsets: IThemeOffsets = { ...theme.offsets };
  const def = offsets.default;
  let didSomething: boolean = false;

  for (let i: number = 0; i < terms.length; i++) {
    switch (terms[i]) {
      case 'type:':
        if (++i < terms.length) {
          let changedType: boolean = true;
          const param = terms[i];
          if (param === 'theme' && def.type !== ColorLayerType.Accent) {
            def.type = ColorLayerType.Accent;
          } else if (param === 'bg' && def.type !== ColorLayerType.Bg) {
            def.type = ColorLayerType.Bg;
          } else if (param === 'switch') {
            def.type = def.type === ColorLayerType.Accent ? ColorLayerType.Bg : ColorLayerType.Accent;
          } else {
            changedType = false;
          }
          if (changedType) { 
            didSomething = true;
          }
        }
        break;
      case 'deepen':
      case 'shade':
        const relative: boolean = (terms[i] === 'deepen');
        if (++i < terms.length) {
          const shade: number = parseInt(terms[i], 10);
          if (!isNaN(shade) && (!relative || shade !== 0)) {
            def.shade = relative ? def.shade + shade : shade;
            didSomething = true;
          }
        }
        break;
    }
  }
  if (didSomething) {
    return { offsets } as Partial<IThemeSettings>;
  }
  return undefined;
}