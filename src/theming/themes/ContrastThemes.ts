import { registerTheme } from "..";

const registerHighContrastTheme = () => registerTheme('HighContrast', {
  parent: 'DarkTheme',
  seedColors: {
    fg: { color: 'white' },
    bg: { color: 'black' },
    accent: { color: '#0078d4' }
  },
  colorSet: {
    backgroundColor: { type: 'bg', shade: 0 },
    color: { type: 'fn', shade: 0, name: 'autofg' },
    borderColor: { type: 'fn', shade: 0, name: 'autofg' }
  },
  settings: {

  },
  styles: {
    container: {
      settings: {
        borderWidth: 1,
        borderStyle: 'solid'
      }
    },
    button: {
      colorSet: {
        backgroundColor: { type: 'bg', shade: 0 }
      },
      settings: {
        borderWidth: 1,
        borderRadius: 0,
        borderStyle: 'solid'
      }
    },
  }
});

const registerOverlayTheme = () => registerTheme('Overlay', {
  parent: 'HighContrast',
  seedColors: {
    fg: { color: 'rgba(255, 255, 255, 0.8)' },
    bg: { color: 'rgba(0, 0, 0, 0.4)' },
    accent: { color: 'rgba(0, 120, 212, 0.4)' }
  }
})

export function registerContrastThemes() {
  registerHighContrastTheme();
  registerOverlayTheme();
}