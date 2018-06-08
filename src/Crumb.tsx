import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import Text from './Text';

// Styles for the component
export interface ICrumbStyles {
  root: IStyle;
}

// Inputs to the component
export interface ICrumbProps {
  renderAs?: string | React.ReactType<ICrumbProps>,
  children?: React.ReactNode;
  className?: string;

  text?: string;

  href?: string;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const view = (props: IViewProps<ICrumbProps, ICrumbStyles>) => {
  const {
    renderAs: RootType = Text,
    classNames,
    ...rest
  } = props;

  return (
    <RootType {...rest} className={classNames.root}>
      {props.text}
    </RootType>
  );
};

const styles = (props: IStyleProps<ICrumbProps, ICrumbStyles>): ICrumbStyles => {
  return {
    root: [
    ]
  };
};

export class StateComponent extends React.Component<any, any> {
  public render() {
    return (this.props.children as any)(this.state);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class CrumbState extends StateComponent {
   constructor(props: ICrumbProps & { children: (props: ICrumbProps) => React.ReactType } ) {
    super(props);
    
    this.state = {
      ...props,

      on: false,
      text: props.text
    }
  }

  public componentDidMount() {
    setInterval(() => {
      const on = !this.state.on;
      this.setState({
        on,
        text: on ? 'Awesome: ' + this.props.text : this.props.text
      });
    }, 1000);
  }
}

export const Crumb = createComponent<ICrumbProps, ICrumbStyles>({
 // state: CrumbState,
  displayName: 'Crumb',
  styles,
  view
});

export default Crumb;
