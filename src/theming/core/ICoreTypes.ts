import { IRawStyle } from "@uifabric/styling";

export interface IBaseState {
  props?: IRawStyle;
  /*
  other theme modules will be in here as well
    seedColors:
    colorSet:
    typography:
    states: {
      ':hover': {
        ...IBaseState
      }
  */
}

export interface IBaseStyle extends IBaseState {
  parent?: string;
}

export type ThemeResolver = () => IBaseStyle;

export interface IBaseTheme extends IBaseStyle {
  definition?: any;
  styles?: {
    [key: string]: IBaseStyle | ThemeResolver;
  }
}

export type IBaseStateDefinition = IBaseState;
export type IBaseStyleDefinition = IBaseStyle;
export type IBaseThemeDefinition = IBaseTheme;

export interface IStyleRequestProps {
  name?: string;
  modules?: { [key: string]: object };
}

export type IModuleDefinition = object;
export type IModuleResolved = object;

/**
 * Function to resolve a definition object to a full theme object
 * @param name name of this module
 * @param obj partially built style or state.  Used for querying other modules
 * @param defaultDef default definition to use as a fallback
 * @param allowPartial if false this should return a full object.  If true only return an
 * object with the specified overrides.  True for state overrides, false for styles
 * @param definition the partial definition to use to create the object
 * @param parent for default styles this will be undefined, for style overrides it will be
 * the resolved default style, for state overrides it will be the parent style
 * 
 * IF not specified the definition object will be the same as the resolved object and it
 * will follow standard merging rules.
 */
export type ThemeDefinitionResolver = (
  name: string,
  obj: IBaseStyle,
  defaultDef: IModuleDefinition | undefined,
  allowPartial: boolean,
  definition?: IModuleDefinition,
  parent?: IBaseStyle,
) => any;

/**
 * This takes information from the resolved module and applies it to the style.
 * @param style style to modify in place.  Similar to object.assign, this both modifies and returns
 * @param module resolved module at this level
 * @param params optional, module specific parameters which can adjust behavior
 */
export type StyleUpdater = (
  style: IRawStyle,
  module: IModuleResolved,
  params?: object
) => IRawStyle;

/**
 * When building up a one off theme this gives a chance for the module to create a definition
 * based on the input string
 * @param theme previous theme to base things on
 * @param definition definition that is being built up.  This will be added to by this call.
 * @param term the current term to parse
 * @param param the next parsed string value (if it exists)
 * returns the number of terms that were handled.  If param is ignored then 1, if param is used
 * then 2
 */
export type ThemeStringHandler = (
  theme: IBaseTheme,
  definition: IBaseThemeDefinition,
  term: string,
  param?: string
) => number;

/**
 * Interface used to register a theme module.  Name is the key value for the module.  A complex module
 * will have a structure like:
 *  ThemeDefinition {
 *    pluginName: { module definition }
 *    ...
 *  }
 * which will produce:
 *  Theme {
 *    pluginName: { resolved module data }
 *    ...
 *  }
 * If no resolver is specified then the definition will be merged and copied to the theme.
 * @param name name of the plug-in.  This will be the key value in the theme
 * @param default default definition
 * @param dependsOn an optional array of other plugins.  These will be resolved before this resolver
 * is called meaning those resolved entries should be available in the theme object passed into the
 * resolver
 * @param resolveDef optional resolver function
 * @param resolveValue optional function which allows transformation of values when queried by clients
 * @param stringConfig handler for using input strings to configure settings
 */
export interface IThemeModuleProps {
  name: string;
  default: IModuleDefinition;
  dependsOn?: string[];
  resolveDef: ThemeDefinitionResolver;
  updateStyle?: StyleUpdater;
  stringConfig?: ThemeStringHandler;
}