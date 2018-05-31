import { DefaultFontStyles, IStyle, Slider } from 'office-ui-fabric-react';
import * as React from 'react';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { SwatchBar } from './SwatchBar';
import { ColorChoice } from './ColorChoice';
import { ThemeContext } from './theming/ThemeProvider';
import { Card } from './Card';
import { Text } from './Text';

// Styles for the component
export interface IConfiguratorStyles {
  root: IStyle;
}

// Inputs to the component
export interface IConfiguratorProps {
  renderAs?: string | React.ReactType<IConfiguratorProps>,
  className?: string;
  updateGapSize?: (newGap: number) => void;
}

const view = (props: IViewProps<IConfiguratorProps, IConfiguratorStyles>) => {
  const {
    renderAs: RootType = Card,
    classNames } = props;

  return (
    <ThemeContext.Consumer>{
      ({theme, updateTheme}) => {
        return (
          <RootType className={classNames.root}>
            <Text>Configuration Options</Text>
            <SwatchBar colors={theme.colors.bgs} />
            <div style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <ColorChoice colorSlot='bg' title='Background' updater={updateTheme} />
              <ColorChoice colorSlot='fg' title='Foreground' updater={updateTheme} />
              <ColorChoice colorSlot='accent' title='Theme Color' updater={updateTheme} />
            </div>
            <Slider label='Gap size' onChange={props.updateGapSize} min={0} max={40} step={4} />
            <SwatchBar colors={theme.colors.themes} />
          </RootType> 
        )
      }
    }</ThemeContext.Consumer>
    
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
