import * as React from "react";
import { IStyle } from "@uifabric/styling";
import { createComponent, IStyleProps, IViewProps } from "./createComponent";
import StackItem, { IStackItemProps } from "./StackItem";

// Styles for the component
export interface IStackStyles {
  root: IStyle;
  spacer: IStyle;
}

const nameMap = {
  start: "flex-start",
  end: "flex-end"
};

// Inputs to the component
export interface IStackProps {
  renderAs?: string | React.ReactType<IStackProps>;
  children?: React.ReactNode;
  className?: string;

  fill?: boolean;
  collapseItems?: boolean;

  inline?: boolean;
  vertical?: boolean;

  grow?: boolean;
  shrink?: boolean;

  gap?: number;
  align?: "auto" | "center" | "start" | "baseline" | "stretch" | "end";
  justify?:
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

  maxWidth?: number | string;
  padding?: number | string;
  margin?: number | string;
}

const view = (props: IViewProps<IStackProps, IStackStyles>) => {
  const {
    renderAs: RootType = "div",
    classNames,
    gap,
    vertical,
    collapseItems
  } = props;

  const children: React.ReactChild[] = React.Children.map(
    props.children,
    (child: React.ReactElement<IStackItemProps>, index: number) => {
      const defaultItemProps: IStackItemProps = {
        gap: index > 0 ? gap : 0,
        vertical,
        collapse: collapseItems
      };

      if ((child as any).type === StackItemType) {
        return React.cloneElement(child as any, {
          ...defaultItemProps,
          ...child.props
        });
      } else {
        // tslint:disable-next-line:no-console
        return <StackItem {...defaultItemProps}>{child}</StackItem>;
      }
    }
  );

  // const spacerStyle = {
  //   [vertical ? "height" : "width"]: gap
  // };

  // React.Children.forEach(props.children, (child, index: number) => {
  //   // if (index > 0 && gap) {
  //   //   children.push(<span className={classNames.spacer} style={spacerStyle} />);
  //   // }
  //   children.push(child);
  // });

  return <RootType className={classNames.root}>{children}</RootType>;
};

const styles = (
  props: IStyleProps<IStackProps, IStackStyles>
): IStackStyles => {
  const {
    fill,
    align,
    justify,
    maxWidth,
    vertical,
    gap,
    grow,
    margin,
    padding
  } = props;

  return {
    root: [
      {
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        alignItems: nameMap[align!] || align,
        justifyContent: nameMap[justify!] || justify,
        flexWrap: "nowrap",
        width: fill && !vertical ? "100%" : "auto",
        height: fill && vertical ? "100%" : "auto",
        maxWidth,
        margin,
        padding
      },
      grow && {
        flexGrow: 1,
        overflow: "hidden"
      },
      props.className
    ],
    spacer: [
      {
        flexShrink: 0,
        alignSelf: "stretch"
      },
      !!gap && {
        [vertical ? "marginBottom" : "marginRight"]: gap
      }
    ]
  };
};

export const Stack = createComponent({
  displayName: "Stack",
  styles,
  view,
  statics: {
    Item: StackItem,
    defaultProps: {}
  }
});

// tslint:disable-next-line:one-variable-per-declaration
const StackItemType = (<StackItem /> as any).type;

export default Stack;
