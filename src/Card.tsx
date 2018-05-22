import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';

// Styles for the component
export interface ICardStyles {
  root: IStyle;
}

// Inputs to the component
export interface ICardProps {
  renderAs?: string | React.ReactType<ICardProps>,
  children?: React.ReactNode;

  className?: string;
  disabled?: boolean;
  id?: string;
  for?: string;
  role?: string;
  href?: string;
  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;

  paletteSet?: string;
}

const view = (props: IViewProps<ICardProps, ICardStyles>) => {
  const {
    renderAs: RootType = 'div',
    classNames,
    ...rest
  } = props;

  return (
    <RootType {...rest} className={classNames.root}>
      {props.children}
    </RootType>
  );
};

const styles = (props: IStyleProps<ICardProps, ICardStyles>): ICardStyles => {
  const { paletteSet = 'default' } = props;
  const set = props.theme.paletteSets[paletteSet];

  return {
    root: [
      {
        background: set.background,
        color: set.text,
        padding: 20,
        border: '1px solid #bababa',
        borderRadius: 2,
        boxShadow: '0 0 20px -5px #000',
        display: 'inline-flex'
      },
      props.className
    ]
  }
};

export const Card = createComponent<ICardProps, ICardStyles>({
  displayName: 'Card',
  styles,
  view
});

export default Card;
