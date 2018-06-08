import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { Crumb, ICrumbProps } from './Crumb';
import { Icon } from 'office-ui-fabric-react';
import Stack from './Stack';

// Styles for the component
export interface IBreadcrumbStyles {
  root: IStyle;
  divider: IStyle;
}

// Inputs to the component
export interface IBreadcrumbProps {
  renderAs?: string | React.ReactType<IBreadcrumbProps>,
  children?: React.ReactNode;
  className?: string;
  items: ICrumbProps[];
}

const view = (props: IViewProps<IBreadcrumbProps, IBreadcrumbStyles>) => {
  const {
    renderAs: RootType = Stack,
    classNames,
    items,
    ...rest
  } = props;

  const children: React.ReactChild[] = [];

  items.forEach((crumbProps: ICrumbProps, index: number) => {
    if (index > 0) {
      children.push(<Icon key={index} className={classNames.divider} iconName='ChevronRight' />);
    }
    children.push(<Crumb key={crumbProps.text} {...crumbProps} />);
  });

  return (
    <RootType {...rest} gap={8} align='center' className={classNames.root}>
      {children}
    </RootType>
  );
};

const styles = (props: IStyleProps<IBreadcrumbProps, IBreadcrumbStyles>): IBreadcrumbStyles => {
  return {
    root: [ props.className ],
    divider: [
      {
        fontSize: 8
      }
    ]
  };
};

export const Breadcrumb = createComponent<IBreadcrumbProps, IBreadcrumbStyles>({
  displayName: 'Breadcrumb',
  styles,
  view
});

export default Breadcrumb;
