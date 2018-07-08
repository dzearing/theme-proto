import { DefaultSwatches as swatches } from "./DefaultSwatches";
import { DefaultTypography as typography } from "./DefaultTypography";
import { IPartialTheme } from "../ITheme";

export const LightTheme: IPartialTheme = {
  swatches,

  typography,

  schemes: {
    default: {
      background: "white",
      hoverBackground: "neutralLight",
      text: "black",
      hoverText: "black",
      link: "themePrimary",
      linkVisited: "themePrimary"
    },

    primary: {
      background: "themePrimary",
      hoverBackground: "themeDark",

      text: "white",
      link: "white",

      linkVisited: "white"
    },

    neutral: {
      background: "neutralTertiaryAlt",
      hoverBackground: "neutralQuaternary",
      text: "black"
    }
  }
};

export default LightTheme;
