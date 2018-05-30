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

/*
  state for the provider component, allows for cascading of states and only updating state
  and re-rendering when there are real changes
*/
export interface IThemeLayerState {
  theme?: ITheme;
  parent?: ITheme;
  theming?: string;
}

/*
  inputs to the provider component for updating the state
*/
export interface IThemeLayerProps {
  theming?: string;
  children: (theme: ITheme) => JSX.Element;
}

export class ThemeLayer extends React.Component<IThemeLayerProps, IThemeLayerState> {
  constructor (props: IThemeLayerProps) {
    super(props);
    this.state = { };
    this._updateTheme = this._updateTheme.bind(this);
  }

  public render() {
    return (
      <ThemeContext.Consumer>{
        inherited => {
          const parent: ITheme = inherited.theme;
          let theme = this.state.theme || parent;
          const updateParent: boolean = (parent !== this.state.parent);
          const theming: string|undefined = this.props.theming;
          const themeChanging: boolean = (theming !== this.state.theming);
  
          // update the state if necessary, parent changed, no theme, or creating a theme with a new string
          if (updateParent || themeChanging || !this.state.theme) {
            if (theming) {
              theme = themeFromChangeString(theming, parent);
            } else if (updateParent) {
              theme = parent;
            }
            this.setState({theme, parent, theming});
          }

          if (this.state.theme !== this.state.parent || !inherited.updateTheme) {
            // if we have created a new theme at this level, or are at the root, wrap the children in a provider
            return (
              <ThemeContext.Provider value={{theme, updateTheme: this._updateTheme}}>
                {this.props.children(theme)}
              </ThemeContext.Provider>
            );
          } else {
            // otherwise just directly feed the theme to children
            return (this.props.children(theme));
          }
        }
      }</ThemeContext.Consumer>
    );
  }

  private _updateTheme(newTheme: ITheme) {
    this.setState({...this.state, theme: newTheme});
  }
}
