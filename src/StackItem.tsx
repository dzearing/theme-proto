import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';

// Styles for the component
export interface IStackAreaStyles {
  root: IStyle;
}

const alignMap = {
  'start': 'flex-start',
  'end': 'flex-end'
};
const justifyMap = {};


// Inputs to the component
export interface IStackAreaProps {
  renderAs?: string | React.ReactType<IStackAreaProps>,
  children?: React.ReactNode;

  grow?: boolean;
  align?: 'auto' | 'center' | 'start' | 'baseline' | 'stretch' | 'end';
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

const view = (props: IViewProps<IStackAreaProps, IStackAreaStyles>) => {
  const {
    renderAs: RootType = 'div',
    classNames
  } = props;

  return (
    <RootType className={classNames.root}>
      {props.children}
    </RootType>
  );
};

const styles = (props: IStyleProps<IStackAreaProps, IStackAreaStyles>): IStackAreaStyles => {
  const { grow, align, justify } = props;

  return {
    root: [
      grow && { flexGrow: 1 },
      !grow && { flexShrink: 0 },
      align && {
        alignSelf: alignMap[align] || align,
        justifyContent: justifyMap[justify!] || justify
      }
    ]
  };
};

export const FlexArea = createComponent<IStackAreaProps, IStackAreaStyles>({
  displayName: 'StackArea',
  styles,
  view
});

export default FlexArea;
