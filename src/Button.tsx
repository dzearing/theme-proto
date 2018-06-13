import { DefaultFontStyles, IStyle } from 'office-ui-fabric-react';
import * as React from 'react';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { IThemeRequest } from './theming/IThemeStyle';
import { fillThemeProps } from './theming/ThemeRequest';

// Styles for the component
export interface IButtonStyles {
  root: IStyle;
}

// Inputs to the component
export interface IButtonProps {
  renderAs?: string | React.ReactType<IButtonProps>,
  children?: React.ReactNode;

  paletteSet?: string;

  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  id?: string;
  for?: string;
  role?: string;
  href?: string;
  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;

  // presentation flags
  primary?: boolean;

  fullWidth?: boolean;

  // non semantic flags bad?
  circle?: boolean;
  color?: string;

  // text
  text?: string;

  // icon
  // icon?: string | IIconProps | (props: IIconProps) => JSX.Element;
  // iconProps?: IIconProps;

  // menu
  // menu?: (props: IMenuProps) => JSX.Element;
  // menuProps?: IMenuProps;

  ariaLabel?: string;
  ariaDescribedBy?: string;

  dataAttributes?: { [key: string]: string; };
}

const view = (props: IViewProps<IButtonProps, IButtonStyles>) => {
  const {
    renderAs: RootType = _getDefaultRootType(props),
    classNames,
    ...rest
  } = props;

  return (
    <RootType { ...rest } className={classNames.root}>
      {props.text}
      {props.children}
    </RootType>
  );
};

function _getDefaultRootType(props: IButtonProps): string {
  return (!!props.href ? 'a' : 'button');
}

const themePropMapping: IThemeRequest = {
  colors: {
    color: 'fg',
    backgroundColor: 'bg',
    borderColor: 'border'
  },
  values: {
    borderRadius: 'cornerRadius',
    borderWidth: 'borderThickness'
  },
  states: {
    ':hover': 'hover',
    ':active': 'press'
  }
}

const styles = (props: IStyleProps<IButtonProps, IButtonStyles>): IButtonStyles => {
  const layerName = props.primary ? 'themedButton' : 'button';

  return {
    root: [
      DefaultFontStyles.medium,
      {
        ...fillThemeProps(props.theme, themePropMapping, layerName),
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'default',
        borderStyle: 'solid',
        display: props.fullWidth ? 'flex' : 'inline-flex',
        width: props.fullWidth ? '100%' : 'auto',
        margin: 0,
        minHeight: 32,
        overflow: 'hidden',
        padding: '0 20px',
        userSelect: 'none',
      },

    ]
  }
};

export const Button = createComponent<IButtonProps, IButtonStyles>({
  displayName: 'Button',
  styles,
  view
});

export default Button;
