import { IThemeDefinition, ITheme } from "./ITheme";
import { registerThemeCore, getThemeCore, getDefaultThemeCore, addThemeCore } from "./core/ThemeRegistry";
import { registerColorSetModule } from "./modules/colorSet";
import { registerTypographyModule } from "./modules/typography/Typography";
import { registerShadedThemes } from "./themes/ShadedThemes";
import { registerContrastThemes } from "./themes/ContrastThemes";
import { createThemeCore } from "./core/ThemeCreation";
import { themeStyleCore } from "./core/themeStyleCore";
import { IStyleRequestProps } from "./core/ICoreTypes";
import { IRawStyle } from "@uifabric/styling";
import { registerStatesModule } from "./modules/states";
export { IThemeDefinition, ITheme } from "./ITheme";

/**
 * This registers a theme into the theming system.  The team can optionally use another
 * registered theme as a baseline.  The theme will not be fully created until it is requested via
 * getTheme
 * @param name Name of the theme to register
 * @param definition Definition used to create the theme
 */
export function registerTheme(name: string, definition: IThemeDefinition) {
  registerThemeCore(name, definition);
}

/**
 * Add a theme created at runtime to the theme registry so it can be referenced by name
 * @param name name for the theme to add
 * @param theme theme to add
 * @param replaceExisting set it to this name no matter what.  If false then the theme will only be set to that
 * name if there was no previous theme of that name
 */
export function addNamedTheme(name: string, definition: Partial<IThemeDefinition>, theme: ITheme, replaceExisting: boolean = true): boolean {
  return addThemeCore(name, definition, theme, replaceExisting);
}

/**
 * This will retrieve a registered theme, if it has not yet been created it will be created
 * on demand.  If the name is unknown it will return the default theme.
 * @param name Name of the theme to retrieve/create
 */
export function getTheme(name: string): ITheme {
  initializeTheming();
  return getThemeCore<ITheme>(name);
}

/**
 * This returns the current default theme
 */
export function getDefaultTheme(): ITheme {
  initializeTheming();
  return getDefaultThemeCore<ITheme>();
}

export function createTheme(definition: Partial<IThemeDefinition>, parentTheme?: ITheme): ITheme {
  initializeTheming();
  return createThemeCore(definition, parentTheme);
}

export function themeStyle(theme: ITheme, props?: string | IStyleRequestProps): IRawStyle {
  return themeStyleCore(theme, props);
}

let themingInitialized: boolean = false;

export function initializeTheming() {
  if (!themingInitialized) {
    themingInitialized = true;

    // register the modules, the color set module will register the seed colors
    registerColorSetModule('seedColors', 'colorSet');
    registerTypographyModule();
    registerStatesModule();

    // load up some default theme defintions
    registerShadedThemes();
    registerContrastThemes();
  }
}
