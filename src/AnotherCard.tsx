import * as React from "react";
import Stack from "./Stack";
import Text from "./Text";
import Card from "./Card";
import { Icon, PersonaCoin } from "office-ui-fabric-react";

export const AnotherCard = () => {
  const RootType = Card;

  return (
    <RootType width={300} height={180} padding={16} data-is-focusable="true">
      <Stack vertical fill gap={4}>
        <Stack align="center" gap={4}>
          <Icon iconName="upload" />
          <Stack.Item grow>
            <Text>Roadmap</Text>
          </Stack.Item>
        </Stack>
        <Text weight="light">Design Studio</Text>

        <Stack vertical grow justify="end">
          <Stack align="center" fill gap={8}>
            <PersonaCoin text="John Jacob Jingleheimershmidt" size={3} />
            <Stack vertical grow gap={4}>
              <Text type="caption">John Jacob Jingleheimershmidt</Text>
              <Text size="small" shrink>
                05/12/2017, 1:33pm
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </RootType>
  );
};

export default AnotherCard;
