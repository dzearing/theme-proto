import { mergeObjects } from "./mergeObjects";
import { createThemeCore } from "./ThemeCreation";
import { DefaultTheme } from "../themes/ShadedThemes";
import { IBaseTheme, IBaseThemeDefinition } from "./ICoreTypes";

interface IThemeReference {
  parent?: string;
  definition: IBaseThemeDefinition;
}

const defaultName: string = 'default';
const parentKey: string = 'parent';

const themeRegistry: { [key: string]: IBaseTheme } = {
}

let themeDefinitions: { [key: string]: IThemeReference } = {
}

export function registerThemeCore(name: string, definition: IBaseThemeDefinition) {
  const parent = definition.hasOwnProperty(parentKey) ? definition[parentKey] : undefined;
  if (!themeDefinitions) {
    themeDefinitions = {};
  }
  themeDefinitions[name] = { parent, definition };
}

export function registerDefaultThemeCore(defaultTheme: IBaseTheme) {
  themeRegistry[defaultName] = defaultTheme;
}

function getResolvedDefinition(name: string): IBaseThemeDefinition | undefined {
  if (themeDefinitions.hasOwnProperty(name)) {
    const thisDef = themeDefinitions[name];
    const parent = thisDef.parent;
    if (parent && themeDefinitions.hasOwnProperty(parent)) {
      return mergeObjects(getResolvedDefinition(parent), thisDef.definition);
    }
    return thisDef.definition;
  }
  return undefined;
}

export function getThemeCore(name: string): IBaseTheme {
  if (themeRegistry.hasOwnProperty(name)) {
    // theme has already been created
    return themeRegistry[name];
  }

  // now no cached theme exists so try the definition
  const definition = getResolvedDefinition(name);
  if (!definition) {
    // fallback to default if it is unknown
    return getDefaultThemeCore();
  }

  // now create the new theme
  themeRegistry[name] = createThemeCore(definition);
  return themeRegistry[name];
}

export function hasTheme(name: string): boolean {
  return themeDefinitions.hasOwnProperty(name);
}

export function getDefaultThemeCore(): IBaseTheme {
  // TODO: this should just use module fallbacks
  if (!themeRegistry[defaultName]) {
    themeRegistry[defaultName] = createThemeCore(DefaultTheme as IBaseThemeDefinition);
  }
  return themeRegistry[defaultName];
}
