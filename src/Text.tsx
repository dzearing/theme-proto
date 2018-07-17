import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import {
  IFontTypes,
  IFontFamilies,
  IFontSizes,
  IFontWeights
} from "./theming/modules/typography/ITypography";
import { themeStyle } from './theming';
import { ITextColorStyles } from './theming/modules/colorSet';

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

  colorStyle?: keyof ITextColorStyles;

  block?: boolean;
  wrap?: boolean;

  grow?: boolean;
  shrink?: boolean;
}

const view = (props: IViewProps<ITextProps, ITextStyles>) => {
  const {
    block,
    classNames,
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
    size,
    colorStyle
  } = props;

  const textParams: any = (type || family || size || weight || colorStyle) ?
    {
      modules: {
        typography: {
          type, family, size, weight
        },
        colorSet: {
          textColor: colorStyle
        }
      }
    } : undefined;

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
