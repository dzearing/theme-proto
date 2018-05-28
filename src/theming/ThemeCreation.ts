import { ITheme } from "./ITheme";
import { getTheme, hasTheme } from "./ThemeRegistry";


/*
  generate a theme settings interface from an update string.  Possible options:
    theme: <name>                       - set the theme with the specified name as active
    type: [theme|bg|switch]             - adjust the type of the default layer as specified
    deepen: number                      - adjust the current shade by the specified number of levels
    shade: number                       - set the current shade to the specified value
    fg|bg|accent: color                 - override the seed colors for the theme
*/
export function themeFromChangeString(update: string, baseline: ITheme): ITheme {
    const terms = update.split(' ');

    for (let i: number = 0; i < terms.length; i++) {
        switch (terms[i]) {
            case 'theme:':
                if (++i < terms.length && hasTheme(terms[i])) {
                    return getTheme(terms[i]);
                }
                break;
            case 'type:':
                if (++i < terms.length) {
                    
                }
        }
    }
}

export function themeFromUpdateString(update: string, theme: ITheme): Partial<IThemeSettings>|undefined {
    const terms = update.split(' ');
    const offsets: IThemeOffsets = { ...theme.settings.offsets };
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