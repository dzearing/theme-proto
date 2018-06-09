import { ITheme } from "./ITheme";
import { getTheme, hasTheme } from "./ThemeRegistry";
import { flipType } from "./IColorLayerKey";
import { createPalette } from "./ThemeColors";
import { createThemeCache } from "./ThemeCache";
import { IThemeSettings } from "./IThemeSettings";

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
          if (!settings.styles) {
            // create a new copy of styles with a copy of the default style to modify
            settings.styles = { ...baseline.styles, default: { ...baseline.styles.default } };
          }
          const styles = settings.styles;
          const newDefault = { ...styles.default.key || { type: 'bg', shade: 0 } };
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
          styles.default.key = newDefault;
        }
        break;
      case 'fg:':
      case 'bg:':
      case 'accent:':
        if (++i < terms.length) {
          const newColor = terms[i];
          if (!settings.seeds) {
            settings.seeds = { ...baseline.seeds };
          }
          const colors = settings.seeds;
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

export function mergeSettings(
  oldVals: Partial<IThemeSettings>, 
  newVals: Partial<IThemeSettings>
): Partial<IThemeSettings> {
  return {
    seeds: Object.assign({}, oldVals.seeds, newVals.seeds),
    styles: Object.assign({}, oldVals.styles, newVals.styles)
  }
}

export function createLayeredTheme(themeSettings: Partial<IThemeSettings>, baseline?: ITheme): ITheme {
  const mergedSettings = baseline ? mergeSettings(baseline, themeSettings) : themeSettings;

  const processedTheme = {
    cache: createThemeCache(themeSettings)
  };

  if (themeSettings.seeds && mergedSettings.seeds) {
    const propName = 'colors';
    processedTheme[propName] = createPalette(mergedSettings.seeds, baseline ? baseline.colors : undefined);
  }

  return Object.assign({}, baseline, mergedSettings, processedTheme);
}
