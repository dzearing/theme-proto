import { DefaultFontStyles, IStyle } from 'office-ui-fabric-react';
import * as React from 'react';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { fillThemeColors, IThemeRequest } from './theming/ThemeRequest';

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

const requiredColors: IThemeRequest = {
  color: 'fg',
  backgroundColor: 'bg'
}

const styles = (props: IStyleProps<IButtonProps, IButtonStyles>): IButtonStyles => {
  const layerName = props.primary ? 'themedControl' : 'shadedControl';

  return {
    root: [
      DefaultFontStyles.medium,
      {
        ...fillThemeColors(props.theme, requiredColors, layerName),
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 2,
        borderWidth: 0,
        cursor: 'default',
        display: props.fullWidth ? 'flex' : 'inline-flex',
        width: props.fullWidth ? '100%' : 'auto',
        margin: 0,
        minHeight: 32,
        overflow: 'hidden',
        padding: '0 20px',
        userSelect: 'none',
        selectors: {
          ':hover': {
            background: 'blue'
          },
          ':active': {
            background: 'green'
          }
        }
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
