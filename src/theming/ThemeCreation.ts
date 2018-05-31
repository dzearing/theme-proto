import { ITheme, IThemeSettings, IThemeColors } from "./ITheme";
import { getTheme, hasTheme } from "./ThemeRegistry";
import { ColorLayerType } from "./IColorLayerKey";
import { getColorFromString } from "../coloring/color";
import { IColorPalette, createColorPalette, ISeedColors } from "./IColorPalette";

/*
  generate a theme settings interface from an update string.  Possible options:
    theme: <name>                       - set the theme with the specified name as active
    type: [themed|bg|switch]             - adjust the type of the default layer as specified
    deepen: number                      - adjust the current shade by the specified number of levels
    shade: number                       - set the current shade to the specified value
    fg|bg|accent: color                 - override the seed colors for the theme
*/
export function themeFromChangeString(update: string, baseline: ITheme): ITheme {
  const terms = update.split(' ');
  const settings: Partial<IThemeSettings> = { };

  for (let i: number = 0; i < terms.length; i++) {
    const cmd = terms[i];
    switch (cmd) {
      case 'theme:':
        if (++i < terms.length && hasTheme(terms[i])) {
            return getTheme(terms[i]);
        }
        break;
      case 'type:':
      case 'deepen:':
      case 'shade:':
        if (++i < terms.length) {
          if (!settings.offsets) {
            settings.offsets = { ...baseline.offsets };
          }
          const newDefault = { ...settings.offsets.default };
          const param = terms[i];
          if (cmd === 'type:') {
            if (param === 'themed') {
              newDefault.type = ColorLayerType.Accent;
            } else if (param === 'bg') {
              newDefault.type = ColorLayerType.Bg;
            } else if (param === 'switch') {
              newDefault.type = newDefault.type === ColorLayerType.Accent ? ColorLayerType.Bg : ColorLayerType.Accent;
            }
          } else {
            const shade: number = parseInt(param, 10);
            if (!isNaN(shade)) {
              newDefault.shade = (cmd === 'deepen:') ? newDefault.shade + shade : shade;
            }
          }
          settings.offsets.default = newDefault;
        }
        break;
      case 'fg:':
      case 'bg:':
      case 'accent:':
        if (++i < terms.length) {
          const newColor = terms[i];
          if (!settings.seedColors) {
            settings.seedColors = { ...baseline.seedColors };
          }
          const colors = settings.seedColors;
          if (cmd === 'fg:') {
            colors.fg = newColor;
          } else if (cmd === 'bg:') {
            colors.bg = newColor;
          } else {
            colors.accent = newColor;
          }
        }
        break;
    }
  }

  const newTheme: ITheme = Object.assign({}, baseline, settings);
  if (settings.seedColors) {
    newTheme.colors = paletteFromSeedColors(settings.seedColors, baseline.colors.seed);
  }
  newTheme.layers = {};
  return newTheme;
}

const fallbackColors: ISeedColors = {
  fg: { h: 0, s: 0, v: 0, a: 100, str: '#000000' },
  bg: { h: 0, s: 0, v: 100, a: 100, str: '#ffffff' },
  accent: { h: 212.26, s: 100, v: 83.14, a: 100, str: '#0062d4' }
}

export function getSeedColors(colors: Partial<IThemeColors>, base?: ISeedColors): ISeedColors {
  const result = { };
  for (const key in colors) {
    if (colors.hasOwnProperty(key)) {
      const color = getColorFromString(colors[key]);
      if (color) {
        result[key] = color;
      }
    }
  }
  return Object.assign({}, base ? base : fallbackColors, result);
}

function paletteFromSeedColors(colors: Partial<IThemeColors>, base?: ISeedColors): IColorPalette {
  return createColorPalette(getSeedColors(colors, base));
}

export function createLayeredTheme(themeSettings: Partial<IThemeSettings>, baseline?: ITheme): ITheme {
  const processedTheme = {
    layers: {}
  };

  if (themeSettings.seedColors) {
    const propName = 'colors';
    processedTheme[propName] = paletteFromSeedColors(themeSettings.seedColors, baseline ? baseline.colors.seed : undefined);
  }

  return Object.assign({}, baseline, themeSettings, processedTheme);
}
