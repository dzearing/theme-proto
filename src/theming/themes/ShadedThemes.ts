import { DefaultTypography } from '../modules/typography/DefaultTypography';
import { registerTheme } from '..';

export const DefaultThemeName = 'LightTheme';

const registerLightTheme = () => registerTheme(DefaultThemeName, {
  palettes: {
    fg: { color: 'black' },
    bg: { color: '#f3f2f1' },
    accent: { color: '#0078d4', anchorColor: true, tonalOnly: true }
  },
  colorSet: {
    backgroundColor: { palette: 'bg', shade: 0 },
    color: { fn: 'autoText', textStyle: 'soft' },
    borderColor: { fn: 'deepen', p1: 2 }
  },
  typography: DefaultTypography,
  layers: {
    button: {
      colorSet: {
        backgroundColor: { fn: 'deepen', p1: 2 },
      },
      settings: {
        borderWidth: 0,
        borderRadius: 2
      },
      states: {
        ':active': {
          colorSet: { backgroundColor: { fn: 'deepen', p1: 2 } }
        },
        ':hover': {
          colorSet: { backgroundColor: { fn: 'deepen', p1: 3 } }
        }
      },
    },
    themedButton: {
      parent: 'button',
      colorSet: {
        backgroundColor: { fn: 'swap', p1: 'accent', p2: 'bg' }
      }
    }
  }
});

const registerDarkTheme = () => registerTheme('DarkTheme', {
  parent: 'LightTheme',
  palettes: {
    fg: { color: 'white' },
    bg: { color: '#c3c3c3' },
    accent: { color: '#0078d4', anchorColor: true, tonalOnly: true }
  },
  layers: {
    default: {}
  }
});

export function registerShadedThemes() {
  registerLightTheme();
  registerDarkTheme();
}

