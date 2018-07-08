import * as React from "react";
import { IStyle } from "@uifabric/styling";
import { createComponent, IStyleProps, IViewProps } from "./createComponent";
import Text from "./Text";
import Card from "./Card";
import Stack from "./Stack";
import { PersonaCoin, IconButton } from "office-ui-fabric-react";
import Button from "./Button";
import Breadcrumb from "./Breadcrumb";

// Styles for the component
export interface ITaskCardStyles {
  root: IStyle;
}

// Inputs to the component
export interface ITaskCardProps {
  as?: string | React.ReactType<ITaskCardProps>;
  children?: React.ReactNode;
  className?: string;

  width?: number;
  height?: number;
  padding?: number;

  scheme?: string;
}

const view = (props: IViewProps<ITaskCardProps, ITaskCardStyles>) => {
  const {
    as: RootType = Card,
    classNames,
    width = 300,
    height = 220,
    padding = 16,
    ...rest
  } = props;

  return (
    <RootType
      {...rest}
      width={width}
      height={height}
      padding={padding}
      className={classNames.root}
      data-is-focusable="true"
    >
      <Stack vertical fill gap={4}>
        <Text weight="bold">
          Portfolio Review jkfldsf jdaskfldas jfkadlsf jdasklfads jfklads
        </Text>
        <Text weight="light">Design Studio</Text>

        <Breadcrumb items={[{ text: "Engineering" }, { text: "Bootcamps" }]} />

        <Button primary text="Primary" />
        <Button text="Default" />

        <Stack vertical grow justify="end">
          <Stack fill gap={8} align="center">
            <PersonaCoin text="David Zearing" size={2} />
            <Stack.Item grow>
              <Text>Peraaaaaason Namef dkalsfdsajkl fsadklj</Text>
            </Stack.Item>
            <Stack>
              <IconButton iconProps={{ iconName: "refresh" }} />
              <IconButton iconProps={{ iconName: "lock" }} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </RootType>
  );
};

const styles = (
  props: IStyleProps<ITaskCardProps, ITaskCardStyles>
): ITaskCardStyles => {
  return {
    root: [props.className]
  };
};

export const TaskCard = createComponent<ITaskCardProps, ITaskCardStyles>({
  displayName: "TaskCard",
  styles,
  view
});

export default TaskCard;
