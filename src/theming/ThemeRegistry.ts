import { ITheme, IThemeDefinition, createLayeredTheme } from "./ITheme";
import { createTheme } from "./createTheme";
import { LightTheme } from "./themes";

const defaultName: string = 'default';

const themeRegistry: { [key: string]: ITheme } = {
}

export function registerTheme(name: string, definition: IThemeDefinition) {
    const newTheme: ITheme = createLayeredTheme(definition);
    themeRegistry[name] = newTheme;
}

export function registerDefaultTheme(definition: IThemeDefinition) {
    registerTheme(defaultName, definition);
}

export function getTheme(name: string): ITheme {
    return themeRegistry[name];
}

export function hasTheme(name: string): boolean {
    return themeRegistry[name] !== undefined;
}

export function getDefaultTheme(): ITheme {
    if (!themeRegistry[defaultName]) {
        themeRegistry[defaultName] = createTheme(LightTheme);
    }
    return themeRegistry[defaultName];
}
