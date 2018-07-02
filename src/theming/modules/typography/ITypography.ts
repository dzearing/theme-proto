export interface IFontFamilies {
  default: string;
  monospace: string;
}

export interface IFontSizes {
  tiny: string;
  xSmall: string;
  small: string;
  medium: string;
  large: string;
  xLarge: string;
  xxLarge: string;
  xxxLarge: string;
  mega: string;
}

export interface IFontWeights {
  light: number | string;
  default: number | string;
  bold: number | string;
}

export interface IFontType {
  fontFamily: keyof IFontFamilies | string;
  fontSize: keyof IFontSizes | number | string;
  fontWeight: keyof IFontWeights | number;
}

export interface IFontTypes {
  default: Partial<IFontType>;
  disabled: Partial<IFontType>;
  caption: Partial<IFontType>;
  h1: Partial<IFontType>;
  h2: Partial<IFontType>;
  h3: Partial<IFontType>;
  h4: Partial<IFontType>;
  h5: Partial<IFontType>;
}

export interface ITypography {
  families: IFontFamilies;
  sizes: IFontSizes;
  weights: IFontWeights;
  types: IFontTypes;
}

export interface ITypographyProps {
  type?: keyof IFontTypes;
  family?: keyof IFontFamilies;
  size?: keyof IFontSizes;
  weight?: keyof IFontWeights;
}
