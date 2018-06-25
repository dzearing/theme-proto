import { registerTheme } from "..";

const registerRainbowTheme = () => registerTheme('TasteTheRainbow', {
  parent: 'LightTheme',
  seedColors: {
    fg: { color: 'white' },
    bg: { color: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'] },
    accent: { color: '#0078d4' }
  },
  colors: {
    bg: { type: 'bg', shade: 0 },
    fg: { type: 'fn', shade: 0, name: 'autofg' },
  }
});

const registerOfficeStyleTheme = () => registerTheme('OfficeStyle', {
  parent: 'LightTheme',
  seedColors: {
    fg: { color: 'white' },
    bg: { color: 'black' },
    accent: { color: '#0078d4' }
  },
  colors: {
    bg: { type: 'bg', shade: 0 },
    fg: { type: 'fn', shade: 0, name: 'autofg' },
  }
});

export function registerCustomThemes() {
  registerRainbowTheme();
  registerOfficeStyleTheme();
}