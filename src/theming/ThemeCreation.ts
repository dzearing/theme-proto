import { ITheme, IThemeSettings } from "./ITheme";
import { getTheme, hasTheme } from "./ThemeRegistry";
import { ColorLayerType } from "./IColorLayerKey";
import { IColor, getColorFromString } from "../coloring/color";


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
}
