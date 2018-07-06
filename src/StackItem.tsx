import * as React from "react";
// import { css } from "@uifabric/utilities";
import { IStyle } from "@uifabric/styling";
import { createComponent, IStyleProps, IViewProps } from "./createComponent";

// Styles for the component
export interface IStackItemStyles {
  root: IStyle;
}

const alignMap = {
  start: "flex-start",
  end: "flex-end"
};
const justifyMap = {};

// Inputs to the component
export interface IStackItemProps {
  renderAs?: string | React.ReactType<IStackItemProps>;
  children?: React.ReactNode;

  gap?: number;
  vertical?: boolean;
  index?: number;

  grow?: boolean;
  collapse?: boolean;

  align?: "auto" | "center" | "start" | "baseline" | "stretch" | "end";
  justify?:
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
}

const view = (props: IViewProps<IStackItemProps, IStackItemStyles>) => {
  const childNodes: Array<React.ReactElement<{}>> = React.Children.toArray(
    props.children
  ) as Array<React.ReactElement<{}>>;
  const first = childNodes[0];

  if (typeof first === "string") {
    return <span className={props.classNames.root}>first</span>;
  }

  return React.cloneElement(
    first as React.ReactElement<{ className: string }>,
    { ...first.props, className: props.classNames.root }
  );
};

const styles = (
  props: IStyleProps<IStackItemProps, IStackItemStyles>
): IStackItemStyles => {
  const { grow, collapse, align, justify, gap, vertical } = props;

  return {
    root: [
      grow && { flexGrow: 1 },
      !grow && !collapse && { flexShrink: 0 },
      align && {
        alignSelf: alignMap[align] || align,
        justifyContent: justifyMap[justify!] || justify
      },
      {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
        // position: "relative",
        // selectors: {
        //   ":after": {
        //     background: "rgba(255, 0, 0, 0.2)",
        //     content: '""',
        //     position: "absolute",
        //     left: 0,
        //     top: 0,
        //     right: 0,
        //     bottom: 0
        //   }
        // }
      },
      !!gap && {
        [vertical ? "marginTop" : "marginLeft"]: gap
      }
    ]
  };
};

export const StackItem = createComponent<IStackItemProps, IStackItemStyles>({
  displayName: "StackItem",
  styles,
  view
});

export default StackItem;
