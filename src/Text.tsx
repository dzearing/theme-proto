import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';

// Styles for the component
export interface ITextStyles {
  root: IStyle;
}

// Inputs to the component
export interface ITextProps {
  renderAs?: string | React.ReactType<ITextProps>,
  children?: React.ReactNode;
  className?: string;

  emphasized?: boolean;
  diminished?: boolean;
  disabled?: boolean;

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

const styles = (props: IStyleProps<ITextProps, ITextStyles>): ITextStyles => {
  const { block, theme, emphasized, diminished, wrap } = props;
  const { fontWeights } = theme;

  return {
    root: [
      theme.fonts.medium,
      {
        display: block ? 'block' : 'inline'
      },
      !wrap && {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },

      emphasized && fontWeights.emphasized,
      diminished && fontWeights.diminished,
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
