import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { IColorRequest, getThemeColors } from './theming/ThemeRequest';

// Styles for the component
export interface ICardStyles {
  root: IStyle;
  content: IStyle;
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

  padding?: number | string;
  width?: number | string;
  height?: number | string;
}

const view = (props: IViewProps<ICardProps, ICardStyles>) => {
  const {
    renderAs: RootType = 'div',
    classNames,
    ...rest
  } = props;

  return (
    <RootType {...rest} className={classNames.root} >
      <div className={classNames.content}>
        {props.children}
      </div>
    </RootType>
  );
};

/*
const view = (props: IViewProps<ICardProps, ICardStyles>) => {
  if (props.deepen || props.themed !== undefined) {
    const newShade: number = props.deepen || 0;
    const newType: ColorLayerType = props.themed === undefined ? ColorLayerType.Relative : ColorLayerType.SwitchRel;
    const newKey: IColorLayerKey = { type: newType, shade: newShade };
    const offsets: Partial<IThemeOffsets> = { default: newKey };
    const themeToSet: Partial<IThemeSettings> = { offsets };
    return (
      <ThemeProvider newTheme={themeToSet}>
        {viewCore}
      </ThemeProvider>
    );
  }
  return viewCore;
};
*/

const layerName = 'default';
const requiredColors: IColorRequest = {
  background: 'bg',
  color: 'fg'
}

const styles = (props: IStyleProps<ICardProps, ICardStyles>): ICardStyles => {
  const { width, height, padding } = props;

  return {
    root: [
      {
        ...getThemeColors(layerName, props.theme, requiredColors),

        boxSizing: 'border-box',
        overflow: 'hidden',
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: '0 0 10px -4px #000',
        display: 'inline-flex',
        width,
        height,
        padding
      },
      props.className
    ],
    content: {
      overflow: 'hidden',
      position: 'relative',
      width: '100%'
    }
  }
};

export const Card = createComponent<ICardProps, ICardStyles>({
  displayName: 'Card',
  styles,
  view
});

export default Card;
