import { registerTheme } from "..";

const registerRainbowTheme = () => registerTheme('TasteTheRainbow', {
  parent: 'LightTheme',
  palettes: {
    fg: { color: 'white' },
    bg: { color: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'] },
    accent: { color: '#0078d4' }
  },
  colorSet: {
    backgroundColor: { palette: 'bg', shade: 0 },
    color: { fn: 'autoText' },
  }
});

const registerOfficeStyleTheme = () => registerTheme('OfficeStyle', {
  parent: 'LightTheme',
  palettes: {
    fg: { color: 'white' },
    bg: { color: 'black' },
    accent: { color: '#0078d4' }
  },
  colorSet: {
    backgroundColor: { palette: 'bg', shade: 0 },
    color: { fn: 'autoText' },
  }
});

export function registerCustomThemes() {
  registerRainbowTheme();
  registerOfficeStyleTheme();
}