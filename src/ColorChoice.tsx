import * as React from 'react';
// import { Button } from './Button';
import { Callout, ColorPicker } from 'office-ui-fabric-react';
import { createRef } from 'office-ui-fabric-react/lib/Utilities';
import { Button } from './Button';
import { ITheme } from './theming/ITheme';
import { getDefaultTheme, registerDefaultTheme } from './theming/ThemeRegistry';
import { createLayeredTheme } from './theming/ThemeCreation';
import { IThemeColors } from './theming/IThemeSettings';
import { Stack } from './Stack';
import { Text } from './Text';
import { SwatchBar } from './SwatchBar';

export interface IColorChoiceProps {
    title: string;
    colorSlot: keyof IThemeColors;
    theme: ITheme;
    updater?: (theme: ITheme) => void;
}

export interface IColorChoiceState {
    calloutVisible: boolean;
    currentColor: string;
}

export function updateDefaultThemeColors(newColors: Partial<IThemeColors>) {
  const defaultTheme = getDefaultTheme();
  const newTheme = createLayeredTheme({ seeds: newColors }, defaultTheme);
  registerDefaultTheme(newTheme);
}

export class ColorChoice extends React.Component<IColorChoiceProps, IColorChoiceState> {
  private _buttonElement = createRef<HTMLElement>();

  public constructor(props: IColorChoiceProps) {
    super(props);

    this.state = {
      calloutVisible: false,
      currentColor: getDefaultTheme().palette.seeds[props.colorSlot].str,
    };
  }

  public render() {
    return (
      <div ref={ this._buttonElement } onClick={ this._onShowColorPicker } style={{width: 500}}>
        <Stack gap={5} fill grow>
          <Button 
            onClick={ this._onShowColorPicker }
            text={this.props.title}
          />
          <Stack vertical align='stretch' fill>
            <Text>{this.state.currentColor}</Text>
            <SwatchBar colors={this.props.theme.palette.colors[this.props.colorSlot]} />
          </Stack>
        </Stack>
        { this.state.calloutVisible ? (
          <Callout
            className='ms-ColorCallout'
            gapSpace={ 0 } 
            setInitialFocus={ true }
            target={ this._buttonElement.value }
            onDismiss={ this._onCalloutDismiss }
          >
            <ColorPicker 
              color={ this.state.currentColor } 
              onColorChanged={ this._onColorChange }
            />
          </Callout>
        ) : (null) }
      </div>
    );
  }

  private _onColorChange = (color: string): void => {
    this.setState({
      currentColor: color
    });

    const newColors = { };
    newColors[this.props.colorSlot] = color;
    updateDefaultThemeColors(newColors);

    if (this.props.updater) {
        this.props.updater(getDefaultTheme());
    }
  }

  private _onShowColorPicker = (): void => {
    this.setState({
      calloutVisible: !this.state.calloutVisible,
    });
  }

  private _onCalloutDismiss = (): void => {
    this.setState({
      calloutVisible: false
    });
  }
}