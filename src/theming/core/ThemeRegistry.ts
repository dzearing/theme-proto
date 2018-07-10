import { mergeObjects } from "./mergeObjects";
import { createThemeCore } from "./ThemeCreation";
import { IBaseTheme, IBaseThemeDef } from "./ICoreTypes";

interface IThemeReference {
  parent?: string;
  definition: IBaseThemeDef;
}

const defaultName: string = 'default';

const themeRegistry: { [key: string]: IBaseTheme } = {
}

let themeDefinitions: { [key: string]: IThemeReference } = {
}

export function registerThemeCore<IThemeDef extends IBaseThemeDef>(name: string, definition: Partial<IThemeDef>) {
  const parent = definition.parent || defaultName;
  if (!themeDefinitions) {
    themeDefinitions = {};
  }
  themeDefinitions[name] = { parent, definition };

  // if this theme has previously been resolved we need to clear dependencies
  if (themeRegistry.hasOwnProperty(name)) {
    delete themeRegistry[name];
    clearDependentThemes(name);
  }
}

function clearDependentThemes(parent: string) {
  const toClear: string[] = [parent];
  let index = 0;
  do {
    const currentParent = toClear[index];
    for (const key in themeDefinitions) {
      if (themeDefinitions.hasOwnProperty(key)) {
        const def = themeDefinitions[key];
        if (def.parent && def.parent === currentParent) {
          // clear things that depend on this one as well
          if (toClear.findIndex((val) => (val === key)) < 0) {
            toClear.push(key);
          }
          // if there is a resolved theme with this name clear that
          if (themeRegistry.hasOwnProperty(key)) {
            delete themeRegistry[key];
          }
        }
      }
    }
    index++;
  } while (index < toClear.length);
}

export function setDefaultTheme(name: string) {
  if (hasTheme(name) && name !== defaultName) {
    registerThemeCore(defaultName, themeDefinitions[name!].definition);
  }
}

function getResolvedDefinition(name: string): IBaseThemeDef | undefined {
  if (themeDefinitions.hasOwnProperty(name)) {
    const thisDef = themeDefinitions[name];
    const parent = thisDef.parent;
    if (parent && parent !== name && themeDefinitions.hasOwnProperty(parent)) {
      return mergeObjects(getResolvedDefinition(parent), thisDef.definition);
    }
    return thisDef.definition;
  }
  return undefined;
}

export function getThemeCore<ITheme extends IBaseTheme>(name?: string): ITheme {
  name = name || defaultName;
  if (themeRegistry.hasOwnProperty(name)) {
    // theme has already been created
    return themeRegistry[name] as ITheme;
  }

  // now no cached theme exists so try the definition
  const definition = getResolvedDefinition(name);
  if (!definition) {
    if (name !== defaultName) {
      return getThemeCore();
    }
    // fallback to empty if asking for the default with none specified
    themeRegistry[defaultName] = createThemeCore({});
    return themeRegistry[defaultName] as ITheme;
  }

  // now create the new theme
  themeRegistry[name] = createThemeCore(definition);
  return themeRegistry[name] as ITheme;
}

export function hasTheme(name: string): boolean {
  return themeDefinitions.hasOwnProperty(name) || themeRegistry.hasOwnProperty(name);
}

export function getDefaultThemeCore<ITheme extends IBaseTheme>(): ITheme {
  return getThemeCore();
}
