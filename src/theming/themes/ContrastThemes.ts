import { registerTheme } from "..";

const registerHighContrastTheme = () => registerTheme('HighContrast', {
  parent: 'DarkTheme',
  palettes: {
    fg: { color: 'white' },
    bg: { color: 'black' },
    accent: { color: '#0078d4', anchorColor: true, tonalOnly: true }
  },
  colorSet: {
    backgroundColor: { palette: 'bg', shade: 0 },
    color: { fn: 'autoText', textStyle: 'soft' },
    borderColor: { palette: 'fg', shade: 0 }
  },
  settings: {

  },
  layers: {
    container: {
      settings: {
        borderWidth: 1,
        borderStyle: 'solid'
      }
    },
    button: {
      colorSet: {
        backgroundColor: { palette: 'bg', shade: 0 }
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
  palettes: {
    fg: { color: 'rgba(255, 255, 255, 0.8)' },
    bg: { color: 'rgba(0, 0, 0, 0.4)' },
    accent: { color: 'rgba(0, 120, 212, 0.4)', anchorColor: true, tonalOnly: true }
  },
  colorSet: {
    color: { palette: 'fg', shade: 0 }
  }
})

export function registerContrastThemes() {
  registerHighContrastTheme();
  registerOverlayTheme();
}