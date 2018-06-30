import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { IThemeRequest, fillThemeProps } from './theming';

// Styles for the component
export interface ICardStyles {
  root: IStyle;
  content: IStyle;
}

// Inputs to the component
export interface ICardProps {
  renderAs?: string | React.ReactType<ICardProps>;
  children?: React.ReactNode;

  className?: string;
  disabled?: boolean;
  id?: string;
  for?: string;
  role?: string;
  href?: string;
  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;

  scheme?: string;

  padding?: number | string;
  width?: number | string;
  height?: number | string;
}

const view = (props: IViewProps<ICardProps, ICardStyles>) => {
  const { renderAs: RootType = "div", classNames, ...rest } = props;

  return (
    <RootType {...rest} className={classNames.root}>
      <div className={classNames.content}>{props.children}</div>
    </RootType>
  );
};

const requiredColors: IThemeRequest = {
  colors: {
    backgroundColor: 'backgroundColor',
    color: 'color',
    borderColor: 'borderColor'
  }
}

const styles = (props: IStyleProps<ICardProps, ICardStyles>): ICardStyles => {
  const { width, height, padding } = props;

  return {
    root: [
      {
        outline: "none",
        selectors: {
          ":focus": {
            border: "1px solid rgba(0,0,0,.5)",
            boxShadow: "0 0 2px 0 rgba(255,255,255,.5) inset",
            boxSizing: "border-box"
          }
        }
      },
      {
        ...fillThemeProps(props.theme, requiredColors, 'container'),
        outline: "none",
        boxSizing: "border-box",
        overflow: "hidden",
        border: "1px solid #ccc",
        borderRadius: 3,
        boxShadow: "0 0 10px -4px #000",
        display: "inline-flex",
        width,
        height,
        padding
      },
      props.className
    ],
    content: {
      overflow: "hidden",
      position: "relative",
      width: "100%"
    }
  };
};

export const Card = createComponent<ICardProps, ICardStyles>({
  displayName: "Card",
  styles,
  view
});

export default Card;
