import { IThemeDefinition } from '../ITheme';
import { DefaultTypography } from '../modules/typography/DefaultTypography';
import { DefaultStyleValues } from '../modules/styleProps/IStyleProps';
import { registerTheme } from '..';

export const DefaultShadedTheme: IThemeDefinition = {
  seedColors: {
    fg: { color: 'black' },
    bg: { color: '#f3f2f1' },
    accent: { color: '#0078d4', anchorColor: true }
  },
  colors: {
    bg: { type: 'bg', shade: 0 },
    fg: { type: 'fn', shade: 0, name: 'autofg' },
    border: { type: 'rel', shade: 2 }
  },
  typography: DefaultTypography,
  values: DefaultStyleValues,
  states: {
    press: {
      colors: { bg: { type: 'rel', shade: 2 } }
    },
    hover: {
      colors: { bg: { type: 'rel', shade: 3 } }
    }
  },
  styles: {
    button: {
      colors: {
        bg: { type: 'rel', shade: 2 }
      },
      values: {
        borderThickness: 0,
        cornerRadius: 2
      }
    },
    themedButton: {
      parent: 'button',
      colors: {
        bg: { type: 'switch', shade: 0 }
      }
    }
  }
}

const registerLightTheme = () => registerTheme('LightTheme', DefaultShadedTheme);

const registerDarkTheme = () => registerTheme('DarkTheme', {
  parent: 'LightTheme',
  seedColors: {
    fg: { color: 'white' },
    bg: { color: '#c3c3c3' },
    accent: { color: '#0078d4' }
  },
  styles: {
    default: {}
  }
});

export function registerShadedThemes() {
  registerLightTheme();
  registerDarkTheme();
}

export const DefaultTheme = DefaultShadedTheme;

