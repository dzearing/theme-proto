import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { IStyleProps } from './createComponent';
// import { ThemeProvider } from './theming/ThemeProvider';
import { Button } from './Button';
import Text from './Text';
import Stack from './Stack';
import { Fabric, FocusZone, Slider } from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import TaskCard from './TaskCard';

initializeIcons();

const RedBox = () => (
  <div
    style={{

      background: 'rgba(0,0,255, .1)',
      minWidth: 40,
      minHeight: 40
    }}
  />
);

class App extends React.Component<{}, { gapSize: number }> {

  constructor(props: {}) {
    super(props);
    this.state = {
      gapSize: 0
    }
  }

  public render(): JSX.Element {
    return (
      <Fabric>
        <Stack vertical gap={20}>
          <Slider label='Gap size' onChange={this._onGapSizeChange} min={0} max={40} step={4} />

          <Stack gap={this.state.gapSize} align='stretch'>

            <Text>I am text</Text>

            <RedBox />

            <Text>I am <Text bold>emphasized</Text> text</Text>

            <Stack.Area grow>
              <RedBox />
            </Stack.Area>

            <Text light>I am diminished</Text>

            <RedBox />

            <Text>I am text</Text>

            <RedBox />
          </Stack>


          <FocusZone>
            <Stack gap={20} vertical>
              <Button paletteSet='primary'>hello</Button>
              <TaskCard />

              <TaskCard paletteSet='neutral' />

              <TaskCard paletteSet='primary' />

            </Stack>
          </FocusZone>

        </Stack>
      </Fabric>
    );
  }

  private _onGapSizeChange = (gapSize: number) => {
    this.setState({ gapSize });
  };
}

ReactDOM.render(
  <App />
  ,
  document.getElementById('root') as HTMLElement
);


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
