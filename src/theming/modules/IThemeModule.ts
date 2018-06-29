import { IBaseStyle, IBaseTheme, IBaseThemeDefinition } from "../core/baseStructure";

export type IModuleDefinition = object;
export type IModuleResolved = object;

/**
 * Function to resolve a definition object to a full theme object
 * @param obj partially built style or state.  Used for querying other plug ins
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
 * This function is used to transofrm a value into a form suitable for external consumption.
 * For colors this would take in an IColor and return the IColor.str field.  Modifier is an
 * optional argument in case this module supports parameterization.
 * @param value the value to extract.  If a value resolver is not specified this will just return
 * the value directly.
 * @param modifier optional modifier to allow lookups into the value.  By default this is ignored.
 */
export type ThemeValueResolver = (
  value: any,
  modifier?: string
) => any;

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
  default?: IModuleDefinition;
  dependsOn?: string[];
  resolveDef?: ThemeDefinitionResolver;
  resolveValue?: ThemeValueResolver;
  stringConfig?: ThemeStringHandler;
}

/**
 * Requests for theme values from a module, the object name should map to the module name
 * key - name of the property to set in the results
 * value - name of the property to query from in the module data
 * mod - optional parameter
 */
export interface IThemeValueRequests {
  [key: string]: string | { value: string, mod?: string };
}

/**
 * Overall request for theme values.  Each key should correspond to a module name
 */
export interface IThemeRequest {
  [key: string]: IThemeValueRequests;
}

