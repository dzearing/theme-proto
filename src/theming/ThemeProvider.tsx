import * as React from 'react';
import { ITheme } from './ITheme';
import { getDefaultTheme, getTheme } from '.';
import { hasTheme } from './core/ThemeRegistry';

/*
  value stored in the context that is available at each level to consumers.
*/
export interface IThemeContextValue {
  theme?: ITheme;
  themeName: string;
}

export const ThemeContext = React.createContext<IThemeContextValue>({ themeName: 'default' });

export const ThemeConsumer = (props: {
  children: (theme: ITheme) => JSX.Element;
}) => (
    <ThemeContext.Consumer>
      {({ themeName, theme }) => props.children(getTheme(themeName))}
    </ThemeContext.Consumer>
  );

export const ThemeLayer = (props: {
  themeName?: string;
  children: (theme: ITheme) => JSX.Element;
}) => (
    <ThemeContext.Consumer>{
      ({ themeName: oldName, theme: oldTheme }) => {
        const propsName = props.themeName;
        const name = propsName && hasTheme(propsName) ? propsName : oldName;
        const newTheme = getTheme(name);
        if (name !== oldName || newTheme !== oldTheme) {
          return (
            <ThemeContext.Provider value={{ themeName: name, theme: newTheme }}>
              {props.children(newTheme)}
            </ThemeContext.Provider>
          );
        }
        return props.children(newTheme);
      }
    }</ThemeContext.Consumer>
  );
