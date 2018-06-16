import * as React from 'react';
import { ITheme } from './ITheme';
import { getDefaultTheme } from './ThemeRegistry';
import { themeFromChangeString } from './ThemeCreation';

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
  theming?: string;
  parent?: ITheme;
  children: (theme: ITheme) => JSX.Element;
}

export class ThemeLayer extends React.Component<IThemeLayerProps, IThemeLayerState> {
  constructor(props: IThemeLayerProps) {
    super(props);
    this.state = {};
    this._updateTheme = this._updateTheme.bind(this);
  }

  public render() {
    const theming = this.props.theming;
    const inheritedParent = this.props.parent;
    const needsProvider: boolean = (theming !== undefined || inheritedParent === undefined);
    const parent = inheritedParent ? inheritedParent : getDefaultTheme();
    const theme = theming ? themeFromChangeString(theming, parent) : parent;

    if (needsProvider) {
      return (
        <ThemeContext.Provider value={{ theme, updateTheme: this._updateTheme }}>
          {this.props.children(theme)}
        </ThemeContext.Provider>
      )
    }
    return (this.props.children(theme));
  }

  private _updateTheme(newTheme: ITheme) {
    this.setState({ ...this.state, theme: newTheme });
  }
}
