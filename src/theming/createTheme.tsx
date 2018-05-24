import { ITheme, IPaletteSet, IThemeSettings } from './ITheme';
import { createColorPalette } from './IColorPalette';
import { getColorFromString } from '../coloring/color';

export function createTheme(themeSettings: IThemeSettings): ITheme {
  const processedTheme = {
    paletteSets: {} as { [key: string]: IPaletteSet }
  };

  for (const setName in themeSettings.paletteSets) {
    if (themeSettings.paletteSets.hasOwnProperty(setName)) {
      const set = themeSettings.paletteSets[setName];
      const targetSet = processedTheme.paletteSets[setName] = {} as any;

      for (const setPropName in set) {
        if (set.hasOwnProperty(setPropName)) {
          targetSet[setPropName] = themeSettings.palette[set[setPropName]] || set[setPropName];
        }
      }
    }
  }

  // create colors from the base global (hacked) values
  const fg = getColorFromString(themeSettings.fg);
  const bg = getColorFromString(themeSettings.bg);
  const themeColor = getColorFromString(themeSettings.accent);

  if (fg && bg && themeColor) {
    const propName: string = 'colors';    // probably some way to get this to not complain
    processedTheme[propName] = createColorPalette(fg, bg, themeColor);
  }

  return processedTheme as ITheme;
}