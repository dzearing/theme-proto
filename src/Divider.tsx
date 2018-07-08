import * as React from "react";
import { createComponent } from "./createComponent";

export interface IDividerProps {
  className: string;
}

export const Divider = createComponent<IDividerProps>({
  displayName: "AnotherCard",
  view: (props: IDividerProps) => <hr />
});
