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
import { themeStyle } from './theming';

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

  const textParams: any = (type || family || size || weight) ?
    { modules: { typography: { type, family, size, weight } } } : undefined;

  return {
    root: [
      {
        ...themeStyle(theme, textParams),
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
