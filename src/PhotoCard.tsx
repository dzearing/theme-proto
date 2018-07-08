import * as React from "react";
import Stack from "./Stack";
import Text from "./Text";
import Card from "./Card";
import { Icon, Image, ImageFit, PersonaCoin } from "office-ui-fabric-react";

export const PhotoCard = (props: React.AllHTMLAttributes<HTMLDivElement>) => {
  const RootType = Card;

  return (
    <RootType {...props} width={300} height={280} data-is-focusable="true">
      <Stack vertical fill gap={4}>
        <Image
          src="http://www.fillmurray.com/400/400"
          height={200}
          imageFit={ImageFit.cover}
        />

        <Stack vertical grow justify="end" padding={16}>
          <Stack align="center" fill gap={8}>
            <PersonaCoin text="John Jacob Jingleheimershmidt" size={3} />
            <Stack vertical grow gap={4}>
              <Text>John Jacob Jingleheimershmidt</Text>
              <Stack.Item shrink>
                <Text type="caption" weight="bold">
                  <Stack gap={8} align="center">
                    <Icon iconName="upload" />
                    05/12/2017, 1:33pm
                    <Icon iconName="share" />
                  </Stack>
                </Text>
              </Stack.Item>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </RootType>
  );
};

export default PhotoCard;
