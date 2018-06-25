import { registerTheme } from "..";

const resisterHighContrastTheme = () => registerTheme('HighContrast', {
  parent: 'DarkTheme',
  seedColors: {
    fg: { color: 'white' },
    bg: { color: 'black' },
    accent: { color: '#0078d4' }
  },
  styles: {
    default: {
      colors: {
        bg: { type: 'bg', shade: 0 },
        fg: { type: 'fn', shade: 0, name: 'autofg' },
        border: { type: 'fn', shade: 0, name: 'autofg' }
      }
    },
    container: {
      values: {
        borderThickness: 1
      }
    },
    button: {
      values: {
        borderThickness: 1,
        cornerRadius: 0
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
  },
  styles: {
    default: {}
  }
})

export function registerContrastThemes() {
  resisterHighContrastTheme();
  registerOverlayTheme();
}