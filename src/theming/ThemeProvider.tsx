import * as React from 'react';
import { ITheme, IThemeSettings, createLayeredTheme } from './ITheme';
import { defaultTheme } from './themes/DefaultTheme';

/*
  value stored in the context that is available at each level to consumers
*/
export interface IThemeContextValue {
  theme: ITheme;
  updateTheme?: (newTheme: ITheme) => void;
}

/*
  state for the provider component, allows for cascading of states
*/
export interface IThemeContextState extends IThemeContextValue {
  parent?: ITheme;
}

/*
  inputs to the provider component for updating the state
*/
export interface IThemeContextProps {
  newTheme?: Partial<IThemeSettings>;
  children?: React.ReactNode;
}

export const ThemeContext = React.createContext<IThemeContextValue>({
  theme: defaultTheme,
  updateTheme: undefined
});

export const ThemeConsumer = (props: { children: (theme: ITheme) => JSX.Element }) => (
  <ThemeContext.Consumer>
    {({theme, updateTheme}) => props.children(theme)}
  </ThemeContext.Consumer>
);

export class ThemeProvider extends React.Component<IThemeContextProps, IThemeContextState> {
  public state: IThemeContextState = {
    theme: defaultTheme,
    updateTheme: (newTheme: ITheme) => { this.setState({theme: newTheme, updateTheme: this.state.updateTheme}) }
  }

  public render() {

    return (
      <ThemeContext.Consumer>{
        contextualTheme => {
          const updateParent: boolean = (contextualTheme.theme !== this.state.parent);
          if (updateParent || this.props.newTheme) {
            this.setState({
              theme: this.props.newTheme ? createLayeredTheme(this.props.newTheme, contextualTheme.theme) : contextualTheme.theme,
              updateTheme: this.state.updateTheme,
              parent: updateParent ? contextualTheme.theme : this.state.parent
            });
          }
          return (
            <ThemeContext.Provider value={{
              theme: this.state.theme,
              updateTheme: this.state.updateTheme
            }}>
              {this.props.children}
            </ThemeContext.Provider>
          )
        }
      }</ThemeContext.Consumer>
    );
  }
}

export const ThemeLayer = (props: { changeTheme?: string, children: (theme: ITheme) => JSX.Element}) => {
  if (props.changeTheme) {
    return (
      <ThemeProvider newTheme={{change: props.changeTheme}}>
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