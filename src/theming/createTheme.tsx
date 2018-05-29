import { ITheme, IPaletteSet } from './ITheme';

export function createTheme(theme: ITheme): ITheme {
  const processedTheme = {
    paletteSets: {} as { [key: string]: IPaletteSet },
    fonts: theme.fonts,
    fontWeights: theme.fontWeights || {}
  };

  for (const setName in theme.paletteSets) {
    if (theme.paletteSets.hasOwnProperty(setName)) {
      const set = theme.paletteSets[setName];
      const targetSet = processedTheme.paletteSets[setName] = {} as any;

      for (const setPropName in set) {
        if (set.hasOwnProperty(setPropName)) {
          targetSet[setPropName] = theme.palette[set[setPropName]] || set[setPropName];
        }
      }
    }
  }

  return processedTheme as ITheme;
}