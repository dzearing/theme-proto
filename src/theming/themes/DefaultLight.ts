import { DefaultFonts, DefaultFontWeights } from './DefaultFonts';
import { IThemeSettings } from '../IThemeSettings';
import { IStyleValues, IThemeStyleDefinition } from '../IThemeStyle';

export const DefaultStyleValues: IStyleValues = {
  fonts: DefaultFonts,
  fontWeights: DefaultFontWeights
}

export const DefaultStyleFallback: IThemeStyleDefinition = {
  colors: {
    bg: { type: 'bg', shade: 0 },
    fg: { type: 'fn', shade: 0, name: 'autofg' }
  },
  values: DefaultStyleValues
}

export const LightTheme: IThemeSettings = {
  seeds: {
    fg: 'black',
    bg: 'white',
    accent: '#0078d4',
    useBgForTone: true,
    invert: false
  },
  styles: {
    default: DefaultStyleFallback,
    container: {
      colors: {
        border: { type: 'rel', shade: 2 }
      }
    },
    control: {
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
      parent: 'control',
      colors: { bg: { type: 'rel', shade: 2 } }
    },
    button: {
      parent: 'shadedControl',
      values: {
        borderThickness: 0,
        cornerRadius: 2
      }
    },
    themedButton: {
      parent: 'button',
      colors: { bg: { type: 'switch', shade: 0 } }
    }
  }
};

export const DefaultTheme = LightTheme;

export default LightTheme;
