import { ITheme, IPaletteSet, IThemeSettings } from './ITheme';
import { createColorPalette } from './IColorPalette';
import { getColorFromString } from '../coloring/color';
import { LightTheme } from './themes';

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
  const seeds = themeSettings.seedColors;
  const fg = getColorFromString(seeds.fg) || LightTheme.seedColors.fg;
  const bg = getColorFromString(seeds.bg) || 'white';
  const accentColor = getColorFromString(seeds.accent) || ;

  const offsetName: string = 'offsets';
  processedTheme[offsetName] = themeSettings.offsets;

  if (fg && bg && accentColor) {
    const propName: string = 'colors';    // probably some way to get this to not complain
    processedTheme[propName] = createColorPalette(fg, bg, accentColor);
  }

  return processedTheme as ITheme;
}