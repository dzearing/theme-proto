import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import {
  IFontTypes,
  IFontFamilies,
  IFontSizes,
  IFontWeights,
  IFontColors
} from "./theming/modules/typography/ITypography";
import { IThemeRequest, fillThemeProps } from './theming';

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
    //    type,
    family,
    weight,
    size
  } = props;
  const typographyRequest: IThemeRequest = {
    typography: {
      fontFamily: { value: 'families', mod: family },
      fontWeight: { value: 'weights', mod: weight },
      fontSize: { value: 'sizes', mod: size }
    }
  }
  // TODO: add typography.types[type] support.  Likely based around a second parameter
  // passed to fontFamily, fontWeight, etc with a handler in the module.

  return {
    root: [
      {
        ...fillThemeProps(theme, Object.assign({}, typographyRequest, requiredColors)),
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
