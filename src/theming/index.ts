import { IThemeDefinition, ITheme } from "./ITheme";
import { registerThemeCore, getThemeCore, getDefaultThemeCore, setDefaultTheme } from "./core/ThemeRegistry";
import { registerTypographyModule } from "./modules/typography/Typography";
import { registerShadedThemes, DefaultThemeName } from "./themes/ShadedThemes";
import { registerContrastThemes } from "./themes/ContrastThemes";
import { createThemeCore } from "./core/ThemeCreation";
import { themeSettingsCore } from "./core/themeStyleCore";
import { ISettingsRequestProps } from "./core/ICoreTypes";
import { IRawStyle } from "@uifabric/styling";
import { registerStatesModule } from "./modules/states";
import { registerColorSetModule } from "./modules/colorSet/colorSet";
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

export function themeStyle(theme: ITheme, props?: string | ISettingsRequestProps): IRawStyle {
  return themeSettingsCore(theme, props);
}

let themingInitialized: boolean = false;

export function initializeTheming() {
  if (!themingInitialized) {
    themingInitialized = true;

    // register the modules, the color set module will register the palettes module
    registerColorSetModule('palettes', 'colorSet');
    registerTypographyModule();
    registerStatesModule();

    // load up some default theme defintions
    registerShadedThemes();
    registerContrastThemes();

    setDefaultTheme(DefaultThemeName);
  }
}
