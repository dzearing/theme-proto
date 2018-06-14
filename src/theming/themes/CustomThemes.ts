import { registerTheme } from "../ThemeRegistry";

const registerRainbowTheme = () => registerTheme('TasteTheRainbow', {
  parent: 'LightTheme',
  settings: {
    seeds: {
      fg: { color: 'white' },
      bg: { color: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'] },
      accent: { color: '#0078d4' }
    },
    styles: {
      default: {
        colors: {
          bg: { type: 'bg', shade: 0 },
          fg: { type: 'fn', shade: 0, name: 'autofg' },
        }
      }
    }
  }
});

const registerOfficeStyleTheme = () => registerTheme('OfficeStyle', {
  parent: 'LightTheme',
  settings: {
    seeds: {
      fg: { color: 'white' },
      bg: { color: 'black' },
      accent: { color: '#0078d4' }
    },
    styles: {
      default: {
        colors: {
          bg: { type: 'bg', shade: 0 },
          fg: { type: 'fn', shade: 0, name: 'autofg' },
        }
      }
    }
  }
});

export function registerCustomThemes() {
  registerRainbowTheme();
  registerOfficeStyleTheme();
}