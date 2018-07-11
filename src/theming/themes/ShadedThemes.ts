import { DefaultTypography } from '../modules/typography/DefaultTypography';
import { registerTheme } from '..';

export const DefaultThemeName = 'LightTheme';

const registerLightTheme = () => registerTheme(DefaultThemeName, {
  seedColors: {
    fg: { color: 'black' },
    bg: { color: '#f3f2f1' },
    accent: { color: '#0078d4', anchorColor: true }
  },
  colorSet: {
    backgroundColor: { type: 'bg', shade: 0 },
    color: { type: 'fn', shade: 0, name: 'autofg' },
    borderColor: { type: 'rel', shade: 2 }
  },
  typography: DefaultTypography,
  layers: {
    button: {
      colorSet: {
        backgroundColor: { type: 'rel', shade: 2 }
      },
      settings: {
        borderWidth: 0,
        borderRadius: 2
      },
      states: {
        ':active': {
          colorSet: { backgroundColor: { type: 'rel', shade: 2 } }
        },
        ':hover': {
          colorSet: { backgroundColor: { type: 'rel', shade: 3 } }
        }
      },
    },
    themedButton: {
      parent: 'button',
      colorSet: {
        backgroundColor: { type: 'switch', shade: 0 }
      }
    }
  }
});

const registerDarkTheme = () => registerTheme('DarkTheme', {
  parent: 'LightTheme',
  seedColors: {
    fg: { color: 'white' },
    bg: { color: '#c3c3c3' },
    accent: { color: '#0078d4' }
  },
  layers: {
    default: {}
  }
});

export function registerShadedThemes() {
  registerLightTheme();
  registerDarkTheme();
}

