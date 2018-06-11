import * as React from "react";
import * as ReactDOM from "react-dom";
// import { IStyleProps } from './createComponent';
// import { ThemeProvider } from './theming/ThemeProvider';
import { Button } from "./Button";
import Text from "./Text";
import Stack from "./Stack";
import { Fabric, FocusZone, Slider, mergeStyles } from "office-ui-fabric-react";
import { initializeIcons } from "@uifabric/icons";
import TaskCard from "./TaskCard";
import Grid from "./Grid";
import AnotherCard from "./AnotherCard";

initializeIcons();

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
      <Fabric>
        <Grid gap={8} templateColumns="40rem 1fr 1fr">
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

          <Button paletteSet="primary">hello</Button>

          <FocusZone>
            <Stack gap={gapSize * 2} justify="center">
              <TaskCard />
              <TaskCard paletteSet="neutral" />
              <TaskCard paletteSet="primary" />
              <AnotherCard />
            </Stack>
          </FocusZone>

          <Text type="h1">I am h1 text</Text>
          <Text type="h2">I am h2 text</Text>
          <Text type="default">I am default text</Text>
          <Text type="caption">I am caption text</Text>
        </Stack>
      </Fabric>
    );
  }

  private _onGapSizeChange = (gapSize: number) => {
    this.setState({ gapSize });
  };
}

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

/*
  <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Card>
            <Button text='Normal button' />
            <Button primary text='Primary button' />
          </Card>

          <Card paletteSet='primary'>
            <Button text='Normal button' />
            <Button paletteSet='default' primary text='Primary button' />
          </Card>

        </div>
        */
