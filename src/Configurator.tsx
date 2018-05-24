import { DefaultFontStyles, IStyle } from 'office-ui-fabric-react';
import * as React from 'react';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import { ITheme } from './theming/ITheme';
import { SwatchBar } from './SwatchBar';
import { ColorChoice } from './ColorChoice';

// Styles for the component
export interface IConfiguratorStyles {
  root: IStyle;
}

// Inputs to the component
export interface IConfiguratorProps {
  renderAs?: string | React.ReactType<IConfiguratorProps>,
  className?: string;
  theme: ITheme;
}

const view = (props: IViewProps<IConfiguratorProps, IConfiguratorStyles>) => {
  const {
    renderAs: RootType = 'div',
    classNames } = props;

  return (
    <RootType className={classNames.root}>
      <SwatchBar colors={props.theme.colors.bgs} />
      <div style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ColorChoice colorSlot='bg' title='Background' />
        <ColorChoice colorSlot='fg' title='Foreground' />
        <ColorChoice colorSlot='theme' title='Theme Color' />
      </div>
      <SwatchBar colors={props.theme.colors.themes} />
    </RootType> 
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
