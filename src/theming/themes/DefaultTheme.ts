import { ITheme } from "../ITheme";
import { createTheme } from "../createTheme";
import { LightTheme } from "./DefaultLight";
import { IColor, getColorFromString } from "../../coloring/color";
import { createColorPalette } from "../IColorPalette";

export let defaultTheme: ITheme = createTheme(LightTheme);

function sameColor(a: IColor, b: IColor): boolean {
  return (a.a === b.a && a.h === b.h && a.s === b.s && a.v === b.v);
}

export function updateDefaultThemeColors(fg?: string, bg?: string, accent?: string) {
  if (fg || bg || accent) {
    const colors = defaultTheme.colors;
    const newFg: IColor = fg ? getColorFromString(fg) || colors.fg : colors.fg;
    const newBg: IColor = bg ? getColorFromString(bg) || colors.bg : colors.bg;
    const newAccent: IColor = accent ? getColorFromString(accent) || colors.theme : colors.theme;
    if (!sameColor(newFg, colors.fg) || !sameColor(newBg, colors.bg) || !sameColor(newAccent, colors.theme)) {
      const newTheme: ITheme = { ...defaultTheme, colors: createColorPalette(newFg, newBg, newAccent) }
      defaultTheme = newTheme;
    }
  }
}

export default defaultTheme;
