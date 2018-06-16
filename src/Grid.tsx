import * as React from "react";
import { IStyle } from "@uifabric/styling";
import { createComponent, IStyleProps, IViewProps } from "./createComponent";
import GridCell from './GridCell';

// Styles for the component
export interface IGridStyles {
  root: IStyle;
}

// Inputs to the component
export interface IGridProps {
  renderAs?: string | React.ReactType<IGridProps>;
  children?: React.ReactNode;
  className?: string;

  width?: number | string;
  height?: number | string;
  margin?: number | string;
  padding?: number | string;

  /**
   * Overrides default block type.
   */
  inline?: boolean;

  templateColumns?: string;
  templateRows?: string;

  /**
   * Defines a grid template by referencing the names of the grid areas which are specified with
   * the grid-area property. Repeating the name of a grid area causes the content to span those cells.
   * A period signifies an empty cell. The syntax itself provides a visualization of the structure of
   * the grid.
   */
  templateAreas?: string;

  gap?: number | string;

  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';

  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
}

const view = (props: IViewProps<IGridProps, IGridStyles>) => {
  const { renderAs: RootType = "div", classNames, children } = props;

  return <RootType className={classNames.root}>{children}</RootType>;
};

const styles = (props: IStyleProps<IGridProps, IGridStyles>): IGridStyles => {
  const { 
    inline,
    templateColumns,
    templateRows,
    templateAreas,
    gap,
    // justifyItems,
    // alignItems,
    // justifyContent,
    // alignContent
  } = props;

  return {
    root: [
      {
        display: inline ? "inline-grid" : "grid",

        gridTemplateColumns: templateColumns,
        gridTemplateRows: templateRows,
        gridTemplateAreas: templateAreas,
        gridGap: gap,
        // gridJustifyItems: justifyItems,
      //  gridAlignItems: alignItems,
      //  gridJustifyContent: justifyContent,
       // gridAlignContent: alignContent
      } as any,
      props.className
    ]
  };
};

export const Grid = createComponent({
  displayName: "Grid",
  styles,
  view,
  statics: {
    Cell: GridCell
  }
});

export default Grid;
