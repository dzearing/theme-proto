import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "./Button";
import Text from "./Text";
import Stack from "./Stack";
import {
  Fabric,
  FocusZone,
  Slider,
  mergeStyles,
  FocusZoneDirection
} from "office-ui-fabric-react";
import { initializeIcons } from "@uifabric/icons";
import TaskCard from "./TaskCard";
import Grid from "./Grid";
import AnotherCard from "./AnotherCard";
import PhotoCard from "./PhotoCard";
import { ThemeLayer } from "./theming/ThemeProvider";
import { Configurator } from "./Configurator";
import { Card } from "./Card";
import { initializeTheming } from "./theming";

initializeIcons();
initializeTheming();

mergeStyles({
  selectors: {
    ":global(html)": {
      fontSize: "10px"
    },
    ":global(body)": {
      padding: 0,
      margin: 0
    }
  }
});

const Box = (props: { background?: string }) => (
  <div
    style={{
      background: props.background || "rgba(255,0,0,.1)",
      minWidth: 40,
      minHeight: 40
    }}
  />
);

class App extends React.Component<{}, { gapSize: number }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      gapSize: 4
    };
  }

  public render(): JSX.Element {
    const { gapSize } = this.state;

    return (
      <ThemeLayer>{() => (
        <Fabric>
          <Configurator updateGapSize={this._onGapSizeChange} />
          <Grid gap={8} templateColumns="1fr 1fr">
            <Grid.Cell debug>
              <Box background="blue" />
            </Grid.Cell>

            <Grid.Cell>
              <Box background="green" />
            </Grid.Cell>

            <Grid.Cell>
              <Box background="yellow" />
            </Grid.Cell>
          </Grid>
          <Stack vertical gap={20} padding={40}>
            <Slider
              label="Gap size"
              onChange={this._onGapSizeChange}
              value={gapSize}
              min={0}
              max={40}
              step={4}
            />

            <Stack gap={gapSize} align="center">
              <Text>I am text</Text>

              <Box />

              <Text>
                I am <Text weight="bold">emphasized</Text> text
              </Text>

              <Stack.Item grow>
                <Box />
              </Stack.Item>

              <Text weight="light" size="large">
                I am diminished
              </Text>

              <Box />

              <Text>I am text</Text>

              <Box />
            </Stack>

            <Button scheme="primary">hello</Button>

            <FocusZone direction={FocusZoneDirection.bidirectional}>
              <Stack vertical gap={gapSize * 2}>
                <Stack gap={gapSize * 2} justify="center">
                  <TaskCard />
                  <TaskCard theming='shade: 1' />
                </Stack>
                <Stack gap={gapSize * 2} justify="center">
                  <TaskCard theming='type: themed' />
                  <TaskCard theming='theme: HighContrast' />
                </Stack>
                <Stack gap={gapSize * 2} justify="center">
                  <AnotherCard />
                  <div style={
                    {
                      backgroundImage: 'url(https://photos.smugmug.com/2009/August/Death-Valley/i-GmpnKpX/0/364fd063/M/20090816-DSC_9876-M.jpg)',
                      width: 260,
                      height: 140,
                      padding: 20
                    }
                  }>
                    <Stack gap={4} theming='theme: Overlay'>
                      <Card padding={10}>
                        <Button text='the' />
                        <Button text='overlay' />
                        <Button text='theme' primary={true} />
                      </Card>
                    </Stack>
                  </div>
                  <PhotoCard />
                </Stack>
              </Stack>
            </FocusZone>

            <Text type="h1" size="tiny">I am h1 text</Text>

            <Text type="h2">I am h2 text</Text>

            <Text type="h3">I am h3 text</Text>

            <Text type="h4">I am h4 text</Text>
            <Text type="h5">I am h5 text</Text>
            <Text type="default">I am default text</Text>
            <Text type="caption">I am caption text</Text>
            <Text type="disabled">I am disabled text</Text>
          </Stack>
        </Fabric>
      )}</ThemeLayer>
    );
  }

  private _onGapSizeChange = (gapSize: number) => {
    this.setState({ gapSize });
  };
}

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

