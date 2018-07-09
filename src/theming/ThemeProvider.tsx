import * as React from 'react';
import { ITheme } from './ITheme';
import { getDefaultTheme, getTheme } from '.';
import { hasTheme } from './core/ThemeRegistry';

/*
  value stored in the context that is available at each level to consumers.
*/
export interface IThemeContextValue {
  theme: ITheme;
}

export const ThemeContext = React.createContext<string>('default');

export const ThemeConsumer = (props: {
  children: (theme: ITheme) => JSX.Element;
}) => (
    <ThemeContext.Consumer>
      {(themeName) => props.children(getTheme(themeName))}
    </ThemeContext.Consumer>
  );

/*
  inputs to the provider component for updating the state
*/
export interface IThemeLayerProps {
  themeName?: string;
  children: (theme: ITheme) => JSX.Element;
}

export const ThemeLayer = ()

export class ThemeLayer extends React.Component<IThemeLayerProps, IThemeLayerState> {
  constructor(props: IThemeLayerProps) {
    super(props);
    this.state = {};
    this._updateTheme = this._updateTheme.bind(this);
  }

  public render() {
    return (<ThemeConsumer>{(inheritedTheme: ITheme) => {
      const themeName = this.props.themeName;
      const needsProvider = themeName && hasTheme(themeName);
      const theme = needsProvider && themeName ? getTheme(themeName) : inheritedTheme;

      if (needsProvider) {
        return (
          <ThemeContext.Provider value={{ theme, updateTheme: this._updateTheme }}>
            {this.props.children(theme)}
          </ThemeContext.Provider>
        )
      }
      return (this.props.children(theme));
    }}</ThemeConsumer>);
  }

  private _updateTheme(newTheme: ITheme) {
    this.setState({ ...this.state, theme: newTheme });
  }
}
