import { ITheme, IThemeSettings } from "./ITheme";
import { getTheme, hasTheme } from "./ThemeRegistry";
import { flipType } from "./IColorLayerKey";
import { createPalette } from "./ThemeColors";

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
          const offsets = settings.offsets;
          const newDefault = { ...offsets.default };
          const param = terms[i];
          if (cmd === 'type:') {
            if (param === 'themed') {
              newDefault.type = 'accent';
            } else if (param === 'bg') {
              newDefault.type = 'bg';
            } else if (param === 'switch') {
              newDefault.type = flipType(newDefault.type);
            }
          } else {
            const shade: number = parseInt(param, 10);
            if (!isNaN(shade)) {
              newDefault.shade = (cmd === 'deepen:') ? newDefault.shade + shade : shade;
            }
          }
          offsets.default = newDefault;
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

  return createLayeredTheme(settings, baseline);
}

export function createLayeredTheme(themeSettings: Partial<IThemeSettings>, baseline?: ITheme): ITheme {
  const processedTheme = {
    layers: {}
  };

  if (themeSettings.seedColors) {
    const propName = 'colors';
    processedTheme[propName] = createPalette(themeSettings.seedColors, baseline ? baseline.colors : undefined);
  }

  return Object.assign({}, baseline, themeSettings, processedTheme);
}
