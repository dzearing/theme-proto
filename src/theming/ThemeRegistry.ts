import { ITheme, IThemeDefinition, IThemeSettings } from "./ITheme";
import { LightTheme } from "./themes";
import { createLayeredTheme } from "./ThemeCreation";

const defaultName: string = 'default';

const themeRegistry: { [key: string]: ITheme } = {
}

const themeDefinitions: { [key: string]: IThemeDefinition } = {
}

export function registerTheme(name: string, definition: IThemeDefinition) {
    themeDefinitions[name] = definition;
}

export function registerDefaultTheme(defaultTheme: ITheme) {
    themeRegistry[defaultName] = defaultTheme;
}

export function getTheme(name: string): ITheme {
    if (!themeRegistry.hasOwnProperty(name) && themeDefinitions.hasOwnProperty(name)) {
        let def = themeDefinitions[name];
        let parentTheme: ITheme = getDefaultTheme();
        const precursors: IThemeDefinition[] = [def];
        while (def.parent && themeDefinitions.hasOwnProperty(def.parent)) {
            // if a parent theme has already been created use that as a baseline
            if (themeRegistry.hasOwnProperty(def.parent)) {
                parentTheme = themeRegistry[def.parent];
                break;
            }
            def = themeDefinitions[def.parent];
            precursors.push(def);
        }

        // build up the settings
        const aggregatedSettings: Partial<IThemeSettings> = {};
        let settings: IThemeDefinition|undefined;
        while (settings = precursors.pop()) {
            Object.assign(aggregatedSettings, settings);
        }

        // now create the new theme
        themeRegistry[name] = createLayeredTheme(aggregatedSettings, parentTheme);
    }
    return themeRegistry[name];
}

export function hasTheme(name: string): boolean {
    return themeDefinitions.hasOwnProperty(name);
}

export function getDefaultTheme(): ITheme {
    if (!themeRegistry[defaultName]) {
        themeRegistry[defaultName] = createLayeredTheme(LightTheme);
    }
    return themeRegistry[defaultName];
}
