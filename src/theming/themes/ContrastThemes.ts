import { registerTheme } from "../ThemeRegistry";
import { DefaultFonts, DefaultFontWeights } from "./DefaultFonts";

const resisterHighContrastTheme = () => registerTheme('HighContrast', {
  parent: 'DarkTheme',
  settings: {
    seeds: {
      fg: 'white',
      bg: 'black',
      accent: '#0078d4'
    },
    styles: {
      default: {
        colors: {
          bg: { type: 'bg', shade: 0 },
          fg: { type: 'fn', shade: 0, name: 'autofg' }
        },
        values: {
          fonts: DefaultFonts,
          fontWeights: DefaultFontWeights
        }
      },
      container: {
        colors: {
          border: { type: 'fn', shade: 0, name: 'autofg' }
        },
        values: {
          borderThickness: 1
        }
      },
      button: {
        parent: 'control',
        colors: {
          border: { type: 'fn', shade: 0, name: 'autofg' }
        },
        values: {
          borderThickness: 1,
          cornerRadius: 0
        }
      },
      themedButton: {
        parent: 'button',
        colors: { bg: { type: 'switch', shade: 0 } }
      }
    }
  }
});

const registerOverlayTheme = () => registerTheme('Overlay', {
  parent: 'HighContrast',
  settings: {
    seeds: {
      fg: 'white',
      bg: 'rgba(0, 0, 0, 0.5)',
      accent: 'rgba(0, 120, 212, 0.5)'
    },
    styles: {
      default: { }
    }
  }
})

export function registerContrastThemes() {
  resisterHighContrastTheme();
  registerOverlayTheme();
}