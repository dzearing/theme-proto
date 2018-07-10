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

export const ThemeLayer = (props: {
  themeName?: string;
  children: (theme: ITheme) => JSX.Element;
}) => (
    <ThemeContext.Consumer>{
      (oldName) => {
        const newName = props.themeName;
        if (newName && newName !== oldName && hasTheme(newName)) {
          return (
            <ThemeContext.Provider value={newName}>
              {props.children(getTheme(newName))}
            </ThemeContext.Provider>
          );
        }
        return props.children(getTheme(oldName));
      }
    }</ThemeContext.Consumer>
  );
