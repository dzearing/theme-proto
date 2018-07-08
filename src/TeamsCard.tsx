import * as React from "react";
import Stack from "./Stack";
import Text from "./Text";
import Box, { IBoxProps } from "./Box";
import Card from "./Card";
import { Icon, PersonaCoin } from "office-ui-fabric-react";

// type AsHtmlElement<Tag extends keyof JSX.IntrinsicElements> = {
//   as: Tag;
// } & JSX.IntrinsicElements[Tag];
// type AsComponent<C> = { as: C } & (C extends React.SFC<infer Props>
//   ? Props & JSX.IntrinsicAttributes
//   : C extends React.ComponentClass<infer Props2>
//     ? Props2 & JSX.IntrinsicAttributes
//     : never);

// // Appropriate overloads:
// function Foo<Tag extends keyof JSX.IntrinsicElements>(x: AsHtmlElement<Tag>): JSX.Element;
// function Foo<Tag>(x: AsComponent<Tag>): JSX.Element;
// function Foo(): never {
//     throw new Error("Magic!");
// }

// interface IFooProps { bar: string; };

// class Foo<TProps = IFooProps> extends React.Component<TProps> {
// }

// const FooAsBox = Foo;

export interface ITeamsCardProps {
  selected?: boolean;
}

export const TeamsCard = (props: ITeamsCardProps) => (
  <Box scheme={props.selected ? "primary" : "default"}>
    <Stack
      height={50}
      fill
      padding="0 20px"
      gap={8}
      data-is-focusable="true"
      align="center"
    >
      <PersonaCoin text="John Jacob Jingleheimershmidt" size={1} presence={1} />

      <Stack.Item grow>
        <Stack vertical>
          <Text>John Jacob Jingleheimershmidt</Text>
          <Text type="caption">
            Message here, it is really long yadayada yada
          </Text>
        </Stack>
      </Stack.Item>

      <Stack vertical shrink align="end">
        <Text>3:30pm</Text>
        <img
          width="12"
          height="16"
          src="//upload.wikimedia.org/wikipedia/commons/c/c3/Microsoft_Skype_for_Business_logo.svg"
        />
      </Stack>
    </Stack>
  </Box>
);

export default TeamsCard;
