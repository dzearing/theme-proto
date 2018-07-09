import * as React from 'react';
import { ITheme } from './ITheme';
import { getDefaultTheme, themeFromChangeString, getTheme } from '.';
import { hasTheme } from './core/ThemeRegistry';

/*
  value stored in the context that is available at each level to consumers.
*/
export interface IThemeContextValue {
  theme: ITheme;
  updateTheme?: (newTheme: ITheme) => void;
}

export const ThemeContext = React.createContext<IThemeContextValue>({
  theme: getDefaultTheme(),
  updateTheme: undefined
});

export const ThemeConsumer = (props: {
  children: (theme: ITheme) => JSX.Element;
}) => (
    <ThemeContext.Consumer>
      {({ theme, updateTheme }) => props.children(theme)}
    </ThemeContext.Consumer>
  );

/*
  state for the provider component, allows for cascading of states and only updating state
  and re-rendering when there are real changes
*/
export interface IThemeLayerState {
  theme?: ITheme;
}

/*
  inputs to the provider component for updating the state
*/
export interface IThemeLayerProps {
  themeName?: string;
  children: (theme: ITheme) => JSX.Element;
}

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
