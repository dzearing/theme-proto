import { DefaultFonts, DefaultFontWeights } from './DefaultFonts';
import { IThemeSettings } from '../IThemeSettings';

export const LightTheme: IThemeSettings = {
  seeds: {
    fg: 'black',
    bg: 'white',
    accent: '#0078d4',
    useBgForTone: false,
    invert: false
  },
  styles: {
    default: { 
      colors: {
        bg: { type: 'bg', shade: 0 }
      },
      values: {
        fonts: DefaultFonts,
        fontWeights: DefaultFontWeights
      }
    },
    controlBase: {
      states: {
        press: {
          colors: { bg: { type: 'rel', shade: 2 } }
        },
        hover: {
          colors: { bg: { type: 'rel', shade: 3 } }
        }
      }
    },
    shadedControl: {
      parent: 'controlBase',
      colors: { bg: { type: 'rel', shade: 2 } }
    },
    themedControl: {
      parent: 'controlBase',
      colors: { bg: { type: 'switch', shade: 0 } }
    }
  }
};

export const DefaultTheme = LightTheme;

export default LightTheme;
