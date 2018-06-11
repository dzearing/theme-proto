import * as React from "react";
import { IStyle } from "@uifabric/styling";
import { createComponent, IStyleProps, IViewProps } from "./createComponent";

// Styles for the component
export interface IGridCellStyles {
  root: IStyle;
}

// Inputs to the component
export interface IGridCellProps {
  renderAs?: string | React.ReactType<IGridCellProps>;
  children?: React.ReactNode;

  area?: string;
  debug?: boolean;
}

const view = (props: IViewProps<IGridCellProps, IGridCellStyles>) => {
  const { renderAs: RootType = 'div', classNames, children } = props;

  return <RootType className={classNames.root}>{children}</RootType>;
};

const styles = (
  props: IStyleProps<IGridCellProps, IGridCellStyles>
): IGridCellStyles => {
  const { area, debug } = props;

  return {
    root: [
      {
        gridArea: area
      },
      debug && {
        border: '2px dashed black'
      }
    ]
  };
};

export const FlexArea = createComponent<IGridCellProps, IGridCellStyles>({
  displayName: 'GridCell',
  styles,
  view
});

export default FlexArea;
