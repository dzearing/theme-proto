
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
  obj: any,
  defaultDef: any,
  allowPartial: boolean,
  definition?: any,
  parent?: any
) => any;

/**
 * This function is used to transofrm a value into a form suitable for external consumption.
 * For colors this would take in an IColor and return the IColor.str field.  Modifier is an
 * optional argument in case this plug in support parameterization.
 * @param value the value to extract.  If a value resolver is not specified this will just return
 * the value directly.
 * @param modifier optional modifier to allow lookups into the value.  By default this is ignored.
 */
export type ThemeValueResolver = (
  value: any,
  modifier?: string
) => any;

/**
 * Interface used to register a theme plugin.  Name is the key value for the plugin.  A complex plugin
 * will have a structure like:
 *  ThemeDefinition {
 *    pluginName: { plugin definition }
 *    ...
 *  }
 * which will produce:
 *  Theme {
 *    pluginName: { resolved plugin data }
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
 */
export interface IThemePluginProps {
  name: string;
  default: any;
  dependsOn?: string[];
  resolveDef?: ThemeDefinitionResolver;
  resolveValue?: ThemeValueResolver;
}

/**
 * Requests for theme values from a plugin, the object name should map to the plugin name
 * key - name of the property to set in the results
 * value - name of the property to query from in the plugin data
 * mod - optional parameter
 */
export interface IThemeValueRequests {
  [key: string]: string | { value: string, mod?: string };
}