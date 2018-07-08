import { DefaultFontStyles, IStyle } from "office-ui-fabric-react";
import * as React from "react";
import { createComponent, IStyleProps, IViewProps } from "./createComponent";
import { Box } from "./Box";
import { Text } from "./Text";

// Styles for the component
export interface IButtonStyles {
  root: IStyle;
}

// Inputs to the component
export interface IButtonProps {
  as?: string | React.ReactType<IButtonProps>;
  children?: React.ReactNode;

  scheme?: string;

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

  dataAttributes?: { [key: string]: string };
}

const view = (props: IViewProps<IButtonProps, IButtonStyles>) => {
  const { as: RootType = Box, classNames, primary, ...rest } = props;

  return (
    <RootType
      scheme={primary ? "primary" : "neutral"}
      {...rest}
      className={classNames.root}
    >
      <Text>
        {props.text}
        {props.children}
      </Text>
    </RootType>
  );
};

function _getDefaultRootType(props: IButtonProps): string {
  return !!props.href ? "a" : "button";
}

const styles = (
  props: IStyleProps<IButtonProps, IButtonStyles>
): IButtonStyles => {
  const { className } = props;
  let { scheme } = props;

  scheme = scheme || (props.primary ? "primary" : "neutral");
  const set = props.theme.schemes[scheme];

  return {
    root: [
      {
        alignItems: "center",
        textAlign: "center",
        borderRadius: 2,
        borderWidth: 0,
        cursor: "default",
        justifyContent: "center",
        display: props.fullWidth ? "flex" : "inline-flex",
        width: props.fullWidth ? "100%" : "auto",
        margin: 0,
        minHeight: 32,
        overflow: "hidden",
        padding: "0 20px",
        userSelect: "none"
      },
      className
    ]
  };
};

export const Button = createComponent<IButtonProps, IButtonStyles>({
  displayName: "Button",
  styles,
  view
});

export default Button;
