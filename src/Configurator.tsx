import { DefaultFontStyles, IStyle, Slider } from 'office-ui-fabric-react';
import * as React from 'react';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { ColorChoice } from './ColorChoice';
import { ThemeConsumer } from './theming/ThemeProvider';
import { Card } from './Card';
import { Text } from './Text';
import { Stack } from './Stack';
import { ITheme } from './theming';

// Styles for the component
export interface IConfiguratorStyles {
  root: IStyle;
}

// Inputs to the component
export interface IConfiguratorProps {
  renderAs?: string | React.ReactType<IConfiguratorProps>,
  className?: string;
  updateGapSize?: (newGap: number) => void;
  updateTheme?: (theme: ITheme) => void;
}

const view = (props: IViewProps<IConfiguratorProps, IConfiguratorStyles>) => {
  const {
    renderAs: RootType = Card,
    classNames } = props;

  return (
    <ThemeConsumer>{
      (theme) => {
        return (
          <RootType className={classNames.root}>
            <Text>Configuration Options</Text>
            <Stack vertical gap={4}>
              <ColorChoice colorSlot='bg' title='Bg' updater={props.updateTheme} theme={theme} />
              <ColorChoice colorSlot='fg' title='Fg' updater={props.updateTheme} theme={theme} />
              <ColorChoice colorSlot='accent' title='Accent' updater={props.updateTheme} theme={theme} />
            </Stack>
            <Slider label='Gap size' onChange={props.updateGapSize} min={0} max={40} step={4} />
          </RootType>
        )
      }
    }</ThemeConsumer>
  );
};

const styles = (props: IStyleProps<IConfiguratorProps, IConfiguratorStyles>): IConfiguratorStyles => {
  return {
    root: [
      DefaultFontStyles.medium,
      {
        alignItems: 'center',
        borderRadius: 2,
        borderWidth: 0,
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: 0,
        minHeight: 32,
        overflow: 'hidden',
        padding: '0 20px',
        userSelect: 'none'
      },
    ]
  }
};

export const Configurator = createComponent<IConfiguratorProps, IConfiguratorStyles>({
  displayName: 'Configurator',
  styles,
  view
});

export default Configurator;
