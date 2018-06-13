import { ITheme } from "./ITheme";
import { getTheme, hasTheme, mergeObjects } from "./ThemeRegistry";
import { createPalette, flipType } from "./ThemeColors";
import { IThemeSettings } from "./IThemeSettings";
import { createThemeCache, getThemeStyle } from "./ThemeCache";
import { IColorLayerKey } from "./IColorLayerKey";

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
  let baseBgKey: IColorLayerKey|undefined;
  let newBgKey: IColorLayerKey|undefined;

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
          if (!baseBgKey || !newBgKey) {
            const defaultStyle = getThemeStyle(baseline);
            const baseColorDef = defaultStyle.definition.colors;
            baseBgKey = (baseColorDef && baseColorDef.bg) ? baseColorDef.bg : { type: 'bg', shade: 0 };
            newBgKey = { ...baseBgKey };
            settings.styles = { default: { colors: { bg: newBgKey } } };
          }
          const param = terms[i];
          if (cmd === 'type:') {
            if (param === 'themed') {
              newBgKey.type = 'accent';
            } else if (param === 'bg') {
              newBgKey.type = 'bg';
            } else if (param === 'switch') {
              newBgKey.type = flipType(newBgKey.type);
            }
          } else {
            const shade: number = parseInt(param, 10);
            if (!isNaN(shade)) {
              newBgKey.shade = (cmd === 'deepen:') ? newBgKey.shade + shade : shade;
            }
          }
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

/**
 * Create a theme, conditionally built upon another existing theme
 * @param themeSettings The partial set of theme settings to use to build the theme
 * @param baseline Baseline theme to layer the new settings on top of
 */
export function createLayeredTheme(themeSettings: Partial<IThemeSettings>, baseline?: ITheme): ITheme {
  const mergedSettings = baseline ? mergeObjects(baseline, themeSettings) : themeSettings;
  let palette = baseline ? baseline.palette : undefined;
  if (!palette || themeSettings.seeds !== undefined) {
    palette = createPalette(mergedSettings.seeds, palette);
  }

  const cache = createThemeCache(palette, mergedSettings);

  return Object.assign({}, baseline, mergedSettings, { palette, cache });
}
