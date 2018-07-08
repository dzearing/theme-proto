import * as React from "react";
import { IStyle } from "@uifabric/styling";
import { createComponent, IStyleProps, IViewProps } from "./createComponent";

// Styles for the component
export interface IBoxStyles {
  root: IStyle;
  content: IStyle;

  selected?: boolean;
  hoverable?: boolean;
}

// Inputs to the component
export interface IBoxProps {
  renderAs?: string | React.ReactType<IBoxProps>;
  children?: React.ReactNode;

  className?: string;
  disabled?: boolean;
  id?: string;
  for?: string;
  role?: string;
  href?: string;
  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;

  scheme?: string;

  elevation?: number;
  padding?: number | string;
  width?: number | string;
  height?: number | string;
}

const view = (props: IViewProps<IBoxProps, IBoxStyles>) => {
  const { renderAs: RootType = "div", classNames, ...rest } = props;

  return <RootType {...rest} className={classNames.root} />;
};

const styles = (props: IStyleProps<IBoxProps, IBoxStyles>): IBoxStyles => {
  const {
    className,
    scheme = "default",
    width,
    height,
    padding,
    elevation = 5
  } = props;
  const set = props.theme.schemes[scheme];

  const elevationPx = elevation * 2;

  return {
    root: [
      {
        background: set.background,
        color: set.text,
        boxSizing: "border-box",
        overflow: "hidden",
        // border: "1px solid #ccc",
        // borderRadius: 3,
        // boxShadow: `0 0 ${elevationPx}px -4px #000`,
        // display: "inline-flex",
        width,
        height,
        padding,
        outline: "none",
        selectors: {
          ":focus": {
            border: "1px solid rgba(0,0,0,.5)",
            boxShadow: `0 0 2px 0 rgba(255,255,255,.5) inset`,
            boxSizing: "border-box"
          },
          ":hover": {
            background: set.hoverBackground,
            color: set.hoverText
          }
        }
      },
      className
    ],
    content: {
      overflow: "hidden",
      position: "relative",
      width: "100%"
    }
  };
};

export const Box = createComponent<IBoxProps, IBoxStyles>({
  displayName: "Box",
  styles,
  view
});

export default Box;
