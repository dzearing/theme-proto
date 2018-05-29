import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import StackItem from './StackItem';

// Styles for the component
export interface IStackStyles {
  root: IStyle;
  spacer: IStyle;
}

const nameMap = {
  'start': 'flex-start',
  'end': 'flex-end'
};

// Inputs to the component
export interface IStackProps {
  renderAs?: string | React.ReactType<IStackProps>,
  children?: React.ReactNode;
  className?: string;

  fill?: boolean;

  inline?: boolean;
  vertical?: boolean;
  grow?: boolean;

  gapSize?: number;

  align?: 'auto' | 'center' | 'start' | 'baseline' | 'stretch' | 'end';
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

  maxWidth?: number | string;
}

const view = (props: IViewProps<IStackProps, IStackStyles>) => {
  const {
    renderAs: RootType = 'div',
    classNames,
    gapSize,
    vertical
  } = props;

  const children: React.ReactChild[] = [];

  React.Children.forEach(props.children, (child, index: number) => {
    if (index !== 0 && gapSize) {
      children.push(<div key={index} className={classNames.spacer} style={{ [vertical ? 'height' : 'width']: gapSize }} />);
    }
    children.push(child);
  });

  return (
    <RootType className={classNames.root}>
      {children}
    </RootType>
  );
};

const styles = (props: IStyleProps<IStackProps, IStackStyles>): IStackStyles => {
  const {
    align,
    fill,
    justify,
    maxWidth,
    vertical,
    grow
  } = props;

  return {
    root: [
      {
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: nameMap[align!] || align,
        justifyContent: nameMap[justify!] || justify,
        flexWrap: 'nowrap',
        width: (fill && !vertical) ? '100%' : 'auto',
        height: (fill && vertical) ? '100%' : 'auto',
        maxWidth,
        flexGrow: grow ? 1 : undefined
      },
      props.className
    ],
    spacer: {
      flexShrink: 0,
      alignSelf: 'stretch'
    }

  };
};

export const Stack = createComponent({
  displayName: 'Stack',
  styles,
  view,
  statics: { Area: StackItem }
});


export default Stack;


