import * as React from 'react';
// import { Button } from './Button';
import { Callout, ColorPicker } from 'office-ui-fabric-react';
import { createRef } from 'office-ui-fabric-react/lib/Utilities';
import { Button } from './Button';
import { ITheme } from './theming/ITheme';
import { getDefaultTheme, registerDefaultTheme } from './theming/ThemeRegistry';
import { getColorFromString, IColor } from './coloring/color';
import { createColorPalette } from './theming/IColorPalette';

export interface IColorChoiceProps {
    title: string;
    colorSlot: string;
    updater?: (theme: ITheme) => void;
}

export interface IColorChoiceState {
    calloutVisible: boolean;
    currentColor: string;
}


function sameColor(a: IColor, b: IColor): boolean {
  return (a.a === b.a && a.h === b.h && a.s === b.s && a.v === b.v);
}

export function updateDefaultThemeColors(fg?: string, bg?: string, accent?: string) {
  if (fg || bg || accent) {
    const defaultTheme = getDefaultTheme();
    const colors = defaultTheme.colors;
    const newFg: IColor = fg ? getColorFromString(fg) || colors.fg : colors.fg;
    const newBg: IColor = bg ? getColorFromString(bg) || colors.bg : colors.bg;
    const newAccent: IColor = accent ? getColorFromString(accent) || colors.theme : colors.theme;
    if (!sameColor(newFg, colors.fg) || !sameColor(newBg, colors.bg) || !sameColor(newAccent, colors.theme)) {
      const newTheme: ITheme = { ...defaultTheme, colors: createColorPalette(newFg, newBg, newAccent), layers: {} }
      registerDefaultTheme(newTheme);
    }
  }
}

export class ColorChoice extends React.Component<IColorChoiceProps, IColorChoiceState> {
  private _buttonElement = createRef<HTMLElement>();

  public constructor(props: IColorChoiceProps) {
    super(props);

    this.state = {
      calloutVisible: false,
      currentColor: getDefaultTheme().colors[props.colorSlot].str,
    };
  }

  public render() {
    return (
      <div ref={ this._buttonElement } onClick={ this._onShowColorPicker } >
        <Button 
          onClick={ this._onShowColorPicker }
          text={ this.props.title + ": " + this.state.currentColor }
        />
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
    switch (this.props.colorSlot) {
        case 'bg':
            updateDefaultThemeColors(undefined, color, undefined);
            break;
        case 'fg':
            updateDefaultThemeColors(color, undefined, undefined);
            break;
        case 'theme':
            updateDefaultThemeColors(undefined, undefined, color);
            break;
    }
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