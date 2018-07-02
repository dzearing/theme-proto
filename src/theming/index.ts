import { IThemeDefinition, ITheme } from "./ITheme";
import { registerThemeCore, getThemeCore, getDefaultThemeCore } from "./core/ThemeRegistry";
import { registerColorSetModule } from "./modules/colorSet";
import { registerTypographyModule } from "./modules/typography/Typography";
import { registerShadedThemes } from "./themes/ShadedThemes";
import { registerContrastThemes } from "./themes/ContrastThemes";
import { themeFromChangeStringCore, createThemeCore } from "./core/ThemeCreation";
import { themeStyleCore } from "./core/ThemeProps";
import { IBaseTheme, IBaseThemeDefinition, IStyleRequestProps } from "./core/baseStructure";
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
  registerThemeCore(name, definition as IBaseThemeDefinition);
}

/**
 * This will retrieve a registered theme, if it has not yet been created it will be created
 * on demand.  If the name is unknown it will return the default theme.
 * @param name Name of the theme to retrieve/create
 */
export function getTheme(name: string): ITheme {
  initializeTheming();
  return getThemeCore(name) as ITheme;
}

/**
 * This returns the current default theme
 */
export function getDefaultTheme(): ITheme {
  initializeTheming();
  return getDefaultThemeCore() as ITheme;
}

/**
 * This takes a change string and returns a new theme with those changes applied.  Options are:
 *  theme: <themeNameNoSpaces>  - like calling getTheme(<name>), will shortcircuit creation of
 *                                a new theme
 *  --- from seedColors module
 *  fg|bg|accent: <color>       - override the specified seed color, this will regenerate the
 *                                color arrays referred to by the sets
 *  --- from colorSets module
 *  type: 'switch'              - toggle between bg and accent
 *  type: <anythingElse>        - type will be set directly to this, allows for custom arrays
 *  deepen: <number>            - adjust the current shade value by the number specified
 *  shade: <number>             - set the current shade value to the number specified
 * @param update this is a shorthand string containing the modifications to make to the baseline
 * theme
 * @param baseline the theme to apply the modifications on top of
 */
export function themeFromChangeString(update: string, baseline: ITheme): ITheme {
  initializeTheming();
  return themeFromChangeStringCore(update, baseline as IBaseTheme) as ITheme;
}

export function createTheme(definition: Partial<IThemeDefinition>, parentTheme?: ITheme): ITheme {
  initializeTheming();
  return createThemeCore(definition as IBaseThemeDefinition, parentTheme as IBaseTheme) as ITheme;
}

export function themeStyle(theme: ITheme, props?: string | IStyleRequestProps): IRawStyle {
  return themeStyleCore(theme as IBaseTheme, props);
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
