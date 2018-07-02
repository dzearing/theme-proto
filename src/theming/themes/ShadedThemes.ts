import { IThemeDefinition } from '../ITheme';
import { DefaultTypography } from '../modules/typography/DefaultTypography';
import { registerTheme } from '..';

export const DefaultShadedTheme: IThemeDefinition = {
  seedColors: {
    fg: { color: 'black' },
    bg: { color: '#f3f2f1' },
    accent: { color: '#0078d4', anchorColor: true }
  },
  colors: {
    backgroundColor: { type: 'bg', shade: 0 },
    color: { type: 'fn', shade: 0, name: 'autofg' },
    borderColor: { type: 'rel', shade: 2 }
  },
  typography: DefaultTypography,
  styles: {
    button: {
      colors: {
        backgroundColor: { type: 'rel', shade: 2 }
      },
      props: {
        borderWidth: 0,
        borderRadius: 2
      },
      states: {
        ':active': {
          colors: { backgroundColor: { type: 'rel', shade: 2 } }
        },
        ':hover': {
          colors: { backgroundColor: { type: 'rel', shade: 3 } }
        }
      },
    },
    themedButton: {
      parent: 'button',
      colors: {
        backgroundColor: { type: 'switch', shade: 0 }
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

