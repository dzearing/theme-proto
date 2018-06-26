import { registerTheme } from "..";

const registerHighContrastTheme = () => registerTheme('HighContrast', {
  parent: 'DarkTheme',
  seedColors: {
    fg: { color: 'white' },
    bg: { color: 'black' },
    accent: { color: '#0078d4' }
  },
  colors: {
    bg: { type: 'bg', shade: 0 },
    fg: { type: 'fn', shade: 0, name: 'autofg' },
    border: { type: 'fn', shade: 0, name: 'autofg' }
  },
  props: {
    borderStyle: 'solid'
  },
  styles: {
    container: {
      props: {
        borderWidth: 1
      }
    },
    button: {
      colors: {
        bg: { type: 'bg', shade: 0 }
      },
      props: {
        borderWidth: 1,
        borderRadius: 0
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