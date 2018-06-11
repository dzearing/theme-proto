import { DefaultFontStyles, FontWeights } from "@uifabric/styling";
import {
  IFontColors,
  IFontFamilies,
  IFontSizes,
  IFontWeights,
  IFontTypes,
  ITypography
} from "../ITypography";

export const DefaultFontSizes: IFontSizes = {
  tiny: "1rem",
  xSmall: "1.2rem",
  small: "1.3rem",
  medium: "1.4rem",
  large: "1.6rem",
  xLarge: "1.8rem",
  mega: "2.5rem"
};

export const DefaultFontFamilies: IFontFamilies = {
  default: DefaultFontStyles.medium.fontFamily!,
  monospace: 'Menlo, Monaco, "Courier New", monospace'
};

export const DefaultFontWeights: IFontWeights = {
  default: FontWeights.regular,
  light: FontWeights.light,
  bold: FontWeights.bold
};

export const DefaultFontColors: IFontColors = {
  default: "",
  caption: "",
  disabled: "",
  success: "",
  error: ""
};

export const DefaultFontTypes: IFontTypes = {
  default: {
    fontFamily: "default",
    fontSize: "medium",
    fontWeight: "default",
    color: "default"
  },

  disabled: {
    color: "disabled"
  },

  caption: {
    fontSize: "small",
    color: "caption"
  },

  h1: {
    fontSize: "xLarge"
  },

  h2: {
    fontSize: "large"
  }
};

export const DefaultTypography: ITypography = {
  families: DefaultFontFamilies,
  sizes: DefaultFontSizes,
  weights: DefaultFontWeights,
  colors: DefaultFontColors,
  types: DefaultFontTypes
};
