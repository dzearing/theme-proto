import { ITheme, IThemeDefinition } from "./ITheme";
import { createLayeredTheme } from "./ThemeCreation";
import { DefaultTheme } from "./themes/DefaultLight";
import { IThemeSettings } from "./IThemeSettings";

export function mergeObjects(a: any, b: any): any {
  const result = { ...a };
  for (let key in b) {
    if (b.hasOwnProperty(key)) {
      const bval = b[key];
      if (typeof bval === 'object'
        && result.hasOwnProperty(key)
        && typeof result[key] === 'object'
      ) {
        result[key] = mergeObjects(result[key], bval);
      } else {
        result[key] = bval;
      }
    }
  }
  return result;
}

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

function getResolvedDefinition(name: string): IThemeDefinition|undefined {
  if (themeDefinitions.hasOwnProperty(name)) {
    const thisDef = themeDefinitions[name];
    const parent = thisDef.parent;
    if (parent && themeDefinitions.hasOwnProperty(parent)) {
      return mergeObjects(getResolvedDefinition(parent), thisDef);
    }
    return thisDef;
  }
  return undefined;
}

export function getTheme(name: string): ITheme {
  if (themeRegistry.hasOwnProperty(name)) {
    // theme has already been created
    return themeRegistry[name];
  }

  // now no cached theme exists so try the definition
  const definition = getResolvedDefinition(name);
  if (!definition) {
      // fallback to default if it is unknown
      return getDefaultTheme();
  }

  
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
        let settings: IThemeDefinition|undefined = precursors.pop();
        while (settings) {
            Object.assign(aggregatedSettings, settings);
            settings = precursors.pop();
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
        themeRegistry[defaultName] = createLayeredTheme(DefaultTheme);
    }
    return themeRegistry[defaultName];
}
