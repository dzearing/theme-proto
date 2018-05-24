import * as React from 'react';
import { ITheme, IThemeSettings, createLayeredTheme, IThemeRef } from './ITheme';
import { defaultThemeRef } from './themes/DefaultTheme';

export const ThemeContext = React.createContext<IThemeRef>(defaultThemeRef);

export const ThemeConsumer = (props: { children: (theme: ITheme) => JSX.Element }) => (
  <ThemeContext.Consumer>
    {(theme) => props.children(theme.ref)}
  </ThemeContext.Consumer>
);

export const ThemeProvider = (props: { themeSettings: Partial<IThemeSettings>, children?: React.ReactNode }): JSX.Element => (
  <ThemeContext.Consumer>{
    contextualTheme => (
      <ThemeContext.Provider value={{ref: createLayeredTheme(props.themeSettings, contextualTheme.ref)}}>
        {props.children}
      </ThemeContext.Provider>
    )
  }</ThemeContext.Consumer>
);

