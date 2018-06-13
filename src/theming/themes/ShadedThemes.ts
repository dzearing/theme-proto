import { DefaultFonts, DefaultFontWeights } from './DefaultFonts';
import { IThemeSettings } from '../IThemeSettings';
import { IStyleValues, IThemeStyleDefinition } from '../IThemeStyle';
import { registerTheme } from '../ThemeRegistry';

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

export const DefaultShaded: IThemeSettings = {
  seeds: {
    fg: 'black',
    bg: '#f3f2f1',
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
      colors: { 
        bg: { type: 'rel', shade: 2 },
        border: { type: 'rel', shade: 2 }
      }
    },
    button: {
      parent: 'shadedControl',
      values: {
        borderThickness: 1,
        cornerRadius: 2
      }
    },
    themedButton: {
      parent: 'button',
      colors: { bg: { type: 'switch', shade: 0 } }
    }
  }
};

const registerLightTheme = () => registerTheme('LightTheme', {
  settings: DefaultShaded
});

const registerDarkTheme = () => registerTheme('DarkTheme', {
  parent: 'LightTheme',
  settings: {
    seeds: {
      fg: 'white',
      bg: '#c3c3c3',
      accent: '#0078d4',
      useBgForTone: false,
      invert: true
    },
    styles: {
      default: { }
    }
  }
});

export function registerShadedThemes() {
  registerLightTheme();
  registerDarkTheme();
}

export const DefaultTheme = DefaultShaded;
