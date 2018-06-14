import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Configurator } from './Configurator';
import { ThemeLayer } from './theming/ThemeProvider';
import Text from './Text';
import Stack from './Stack';
import { FocusZone, Fabric } from 'office-ui-fabric-react';
import { Button } from './Button';
import { initializeIcons } from '@uifabric/icons';
import TaskCard from './TaskCard';
import { initializeTheming } from './theming/ThemeRegistry';
import { Card } from './Card';

initializeIcons();
initializeTheming();

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
        <ThemeLayer>{() => (
          <Stack vertical gap={20}>
            <Configurator updateGapSize={this._onGapSizeChange} />

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
                <Button>hello</Button>
                <TaskCard />

                <TaskCard theming='deepen: 1' />

                <TaskCard theming='type: themed' />

                <TaskCard theming='theme: HighContrast' />

                <div style={
                  {
                  backgroundImage: 'url(https://photos.smugmug.com/2009/August/Death-Valley/i-GmpnKpX/0/364fd063/M/20090816-DSC_9876-M.jpg)',
                  width: 260, 
                  height: 140,
                  padding: 20}
                }>
                  <Stack gap={4} theming='theme: Overlay'>
                    <Card padding={10}>
                      <Button text='the' />
                      <Button text='overlay' />
                      <Button text='theme' primary={true} />
                    </Card>
                  </Stack>
                </div>

              </Stack>
            </FocusZone>

          </Stack >
        )}</ThemeLayer>
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
