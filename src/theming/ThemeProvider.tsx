import * as React from 'react';
import { ITheme } from './ITheme';
import { getDefaultTheme } from './ThemeRegistry';

/*
  value stored in the context that is available at each level to consumers
*/
export interface IThemeContextValue {
  theme: ITheme;
  updateTheme?: (newTheme: ITheme) => void;
}

/*
  state for the provider component, allows for cascading of states and only updating state
  and re-rendering when there are real changes
*/
export interface IThemeContextState {
  theme: ITheme;
  parent?: ITheme;
  themeChange?: string;
}

/*
  inputs to the provider component for updating the state
*/
export interface IThemeContextProps {
  themeChange?: string;
  children?: React.ReactNode;
}

export const ThemeContext = React.createContext<IThemeContextValue>({
  theme: getDefaultTheme(),
  updateTheme: undefined
});

export const ThemeConsumer = (props: { children: (theme: ITheme) => JSX.Element }) => (
  <ThemeContext.Consumer>
    {({theme, updateTheme}) => props.children(theme)}
  </ThemeContext.Consumer>
);

export class ThemeProvider extends React.Component<IThemeContextProps, IThemeContextState> {
  public state: IThemeContextState = {
    theme: getDefaultTheme(),
    parent: undefined,
    themeChange: undefined 
  }

  public render() {

    return (
      <ThemeContext.Consumer>{
        contextualTheme => {
          const updateParent: boolean = (contextualTheme.theme !== this.state.parent);
          const changeString: string|undefined = this.props.themeChange;
          const themeChanging: boolean = (this.props.themeChange !== this.state.themeChange);
          if (updateParent || themeChanging || !this.state.theme) {
            const newTheme = this.props.themeChange 
              ? themeFromChangeString(this.props.themeChange, contextualTheme.theme)
              : contextualTheme.theme;
            this.setState({
              theme: newTheme,
              parent: updateParent ? contextualTheme.theme : this.state.parent,
              themeChange: this.props.themeChange
            });
          }
          return (
            <ThemeContext.Provider value={{
              theme: this.state.theme,
              updateTheme: contextualTheme.updateTheme
            }}>
              {this.props.children}
            </ThemeContext.Provider>
          )
        }
      }</ThemeContext.Consumer>
    );
  }
}

export const ThemeLayer = (props: { themeChange?: string, children: (theme: ITheme) => JSX.Element}) => {
  if (props.themeChange) {
    return (
      <ThemeProvider themeChange={props.themeChange}>
        <ThemeContext.Consumer>
          {({theme, updateTheme}) => props.children(theme)}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeContext.Consumer>
        {({theme, updateTheme}) => props.children(theme)}
      </ThemeContext.Consumer>
    );
  }
}