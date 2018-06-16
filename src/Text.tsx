import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { IThemeRequest } from './theming/IThemeStyle';
import { fillThemeProps } from './theming/ThemeRequest';
import {
  IFontTypes,
  IFontFamilies,
  IFontSizes,
  IFontWeights,
  IFontColors
} from "./theming/ITypography";
import { getThemeStyle } from './theming/ThemeCache';

// Styles for the component
export interface ITextStyles {
  root: IStyle;
}

// Inputs to the component
export interface ITextProps {
  renderAs?: string | React.ReactType<ITextProps>;
  children?: React.ReactNode;
  className?: string;

  type?: keyof IFontTypes;
  family?: keyof IFontFamilies;
  size?: keyof IFontSizes;
  weight?: keyof IFontWeights;
  color?: keyof IFontColors;

  paletteSet?: string;

  block?: boolean;
  wrap?: boolean;

  grow?: boolean;
  shrink?: boolean;
}

const view = (props: IViewProps<ITextProps, ITextStyles>) => {
  const {
    block,
    classNames,
    color,
    family,
    grow,
    renderAs: RootType = "span",
    shrink,
    size,
    type,
    weight,
    wrap,
    ...rest
  } = props;

  return <RootType {...rest} className={classNames.root} />;
};

const requiredColors: IThemeRequest = {
  colors: {
    color: 'fg'
  }
}

const styles = (props: IStyleProps<ITextProps, ITextStyles>): ITextStyles => {
  const {
    block,
    theme,
    wrap,
    grow,
    shrink,
    type,
    family,
    weight,
    size
  } = props;
  const style = getThemeStyle(theme);
  const typography = style.values.typography;
  const themeType = typography.types[type!] || {
    fontFamily: typography.families[family!] || typography.families.default,
    fontWeight: typography.weights[weight!] || typography.weights.default,
    fontSize: typography.sizes[size!] || typography.sizes.medium
  };

  return {
    root: [
      themeType,
      {
        ...fillThemeProps(theme, requiredColors),
        display: block ? "block" : "inline"
      },
      !wrap && {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      grow && {
        flexGrow: 1
      },
      shrink && {
        flexShrink: 0
      },
      props.className
    ]
  } as ITextStyles;
};

export const Text = createComponent<ITextProps, ITextStyles>({
  displayName: "Text",
  styles,
  view
});

export default Text;
