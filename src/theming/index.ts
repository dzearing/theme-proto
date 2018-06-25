import { IThemeDefinition, ITheme } from "./ITheme";
import { registerThemeCore, getThemeCore, getDefaultThemeCore } from "./core/ThemeRegistry";
import { registerColorSetModule } from "./modules/colorSets/ColorSets";
import { registerTypographyModule } from "./modules/typography/Typography";
import { registerStylePropsModule } from "./modules/styleProps/IStyleProps";
import { registerShadedThemes } from "./themes/ShadedThemes";
import { registerContrastThemes } from "./themes/ContrastThemes";
import { themeFromChangeStringCore, createThemeCore } from "./core/ThemeCreation";
import { IThemeRequest } from "./modules/IThemeModule";
import { fillThemePropsCore } from "./core/ThemeProps";

export { IThemeDefinition, ITheme } from "./ITheme";
export { IThemeRequest } from "./modules/IThemeModule";

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
  return themeFromChangeStringCore(update, baseline) as ITheme;
}

export function createTheme(definition: Partial<IThemeDefinition>, parentTheme?: ITheme): ITheme {
  initializeTheming();
  return createThemeCore(definition, parentTheme) as ITheme;
}

/**
 * Map properties from a particular style of a theme into the schema of the requestor
 * @param theme Theme to obtain properties from
 * @param request Property mappings to perform
 * @param styleName Name of the style to get props for.  undefined is the equivalent of
 * default
 */
export function fillThemeProps(theme: ITheme, request: IThemeRequest, styleName?: string): any {
  return fillThemePropsCore(theme, request, styleName);
}

let themingInitialized: boolean = false;

export function initializeTheming() {
  if (!themingInitialized) {
    themingInitialized = true;

    // register the modules, the color set module will register the seed colors
    registerColorSetModule();
    registerTypographyModule();
    registerStylePropsModule();

    // load up some default theme defintions
    registerShadedThemes();
    registerContrastThemes();
  }
}
