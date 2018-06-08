import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { IColorLayer } from './theming/IColorLayer';

// Styles for the component
export interface ISwatchBarStyles {
  root: IStyle;
}

// Inputs to the component
export interface ISwatchBarProps {
  renderAs?: string | React.ReactType<ISwatchBarProps>,
  className?: string;
  colors: IColorLayer[];
}

const view = (props: IViewProps<ISwatchBarProps, ISwatchBarStyles>) => {
  const {
    renderAs: RootType = 'div',
    classNames,
    ...rest
  } = props;

  return (
    <RootType {...rest} className={classNames.root}>
      { props.colors.map((value: IColorLayer, index: number) => {
        return (<div key={index} style={{height:5, width:'100%', background: value.clr.bg.str}} />);
      })}
    </RootType>
  );
};

const styles = (props: IStyleProps<ISwatchBarProps, ISwatchBarStyles>): ISwatchBarStyles => {

  return {
    root: [
      {
        border: '1px solid #bababa',
        borderRadius: 2,
        display: 'inline-flex',
        direction: 'row',
        width: '100%'
      },
      props.className
    ],
  }
};

export const SwatchBar = createComponent<ISwatchBarProps, ISwatchBarStyles>({
  displayName: 'SwatchBar',
  styles,
  view
});

export default SwatchBar;