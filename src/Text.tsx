import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { IThemeRequest, fillThemeColors } from './theming/ThemeRequest';
import { getThemeStyle } from './theming/ThemeCache';

// Styles for the component
export interface ITextStyles {
  root: IStyle;
}

// Inputs to the component
export interface ITextProps {
  renderAs?: string | React.ReactType<ITextProps>,
  children?: React.ReactNode;
  className?: string;

  // font type
  monospace?: boolean;

  // weights
  bold?: boolean;
  light?: boolean;

  // colors
  disabled?: boolean;
  success?: boolean;
  failure?: boolean;

  // sizes
  tiny?: boolean;
  smaller?: boolean;
  small?: boolean;
  h4?: boolean;
  h3?: boolean;
  h2?: boolean;
  h1?: boolean;

  paletteSet?: string;

  block?: string;
  wrap?: string;
}

const view = (props: IViewProps<ITextProps, ITextStyles>) => {
  const {
    renderAs: RootType = 'span',
    classNames,
    ...rest
  } = props;

  return (
    <RootType {...rest} className={classNames.root}>
      {props.children}
    </RootType>
  );
};

const requiredColors: IThemeRequest = {
  color: 'fg'
}

const styles = (props: IStyleProps<ITextProps, ITextStyles>): ITextStyles => {
  const { block, theme, bold, light, wrap } = props;
  const themeStyle = getThemeStyle(theme);
  const fontWeights = themeStyle.fontWeights;

  return {
    root: [
      themeStyle.fonts.medium,
      {
        ...fillThemeColors(theme, requiredColors),
        display: block ? 'block' : 'inline'
      },
      !wrap && {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },

      bold && fontWeights.emphasized,
      light && fontWeights.diminished,
      props.className
    ]
  };
};

export const Text = createComponent<ITextProps, ITextStyles>({
  displayName: 'Text',
  styles,
  view
});

export default Text;
