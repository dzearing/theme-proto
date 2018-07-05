import { mergeObjects } from "./mergeObjects";
import { createThemeCore } from "./ThemeCreation";
import { DefaultTheme } from "../themes/ShadedThemes";
import { IBaseTheme, IBaseThemeDef } from "./ICoreTypes";

interface IThemeReference {
  parent?: string;
  definition: IBaseThemeDef;
}

const defaultName: string = 'default';
const parentKey: string = 'parent';

const themeRegistry: { [key: string]: IBaseTheme } = {
}

let themeDefinitions: { [key: string]: IThemeReference } = {
}

export function registerThemeCore<IThemeDef extends IBaseThemeDef>(name: string, definition: IThemeDef) {
  const parent = definition.hasOwnProperty(parentKey) ? definition[parentKey] : undefined;
  if (!themeDefinitions) {
    themeDefinitions = {};
  }
  themeDefinitions[name] = { parent, definition };
}

export function registerDefaultThemeCore<ITheme extends IBaseTheme>(defaultTheme: ITheme) {
  if (!themeRegistry[defaultName]) {
    // new theme, just set it so it exists
    themeRegistry[defaultName] = defaultTheme;
  } else {
    // existing default theme...overwrite the properties to update cached references
    Object.assign(themeRegistry[defaultName], defaultTheme);
  }
}

function getResolvedDefinition(name: string): IBaseThemeDef | undefined {
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

export function getThemeCore<ITheme extends IBaseTheme>(name: string): ITheme {
  if (themeRegistry.hasOwnProperty(name)) {
    // theme has already been created
    return themeRegistry[name] as ITheme;
  }

  // now no cached theme exists so try the definition
  const definition = getResolvedDefinition(name);
  if (!definition) {
    // fallback to default if it is unknown
    return getDefaultThemeCore();
  }

  // now create the new theme
  themeRegistry[name] = createThemeCore(definition);
  return themeRegistry[name] as ITheme;
}

export function hasTheme(name: string): boolean {
  return themeDefinitions.hasOwnProperty(name);
}

export function getDefaultThemeCore<ITheme extends IBaseTheme>(): ITheme {
  // TODO: this should just use module fallbacks
  if (!themeRegistry[defaultName]) {
    themeRegistry[defaultName] = createThemeCore(DefaultTheme as IBaseThemeDef);
  }
  return themeRegistry[defaultName] as ITheme;
}
