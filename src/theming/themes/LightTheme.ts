import { createTheme } from "../createTheme";
import { DefaultSwatches as swatches } from "./DefaultSwatches";
import { DefaultTypography as typography } from "./DefaultTypography";
export const LightTheme = createTheme({
  swatches,
  typography,

  paletteSets: {
    default: {
      background: "white",
      text: "black",
      link: "themePrimary",
      linkVisited: "themePrimary"
    },

    primary: {
      background: "themePrimary",
      text: "white",
      link: "white",
      linkVisited: "white"
    },

    neutral: {
      background: "neutralTertiaryAlt",
      text: "black",
      link: "white",
      linkVisited: "white"
    }
  }
});

export default LightTheme;
