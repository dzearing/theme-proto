import * as React from 'react';
import { ITheme } from './ITheme';
import DefaultLight from './themes/DefaultLight';

const ThemeContext = React.createContext<ITheme>(DefaultLight);

export const ThemeConsumer = (props: { children: (theme: ITheme) => JSX.Element }) => (
  <ThemeContext.Consumer>
    {theme => props.children(theme)}
  </ThemeContext.Consumer>
);

export const ThemeProvider = (props: { theme: Partial<ITheme>, children?: React.ReactNode }): JSX.Element => (
  <ThemeContext.Consumer>
    {contextualTheme => (
      <ThemeContext.Provider value={Object.assign({}, DefaultLight, contextualTheme, props.theme)}>
        {props.children}
      </ThemeContext.Provider>
    )}
  </ThemeContext.Consumer>
);

