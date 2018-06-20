import { mergeObjects } from "../ThemeRegistry";
import { IThemePluginProps } from "./IThemePlugin";

const themePlugins = {};

export function registerThemePlugIn(props: IThemePluginProps) {
  themePlugins[props.name] = props;
}

/**
 * Standard function to resolve a theme definition into a theme object.  In the case where no
 * override is present this will simply merge properties together.  This is called in the
 * following scenarios:
 * 
 *  default style:
 *    allowPartial: false, parent: undefined, return a fully resolved style
 *  named style:
 *    allowPartial: false, parent: defaultStyle, return fully resolved style
 *  state:
 *    allowPartial: true, parent: base style, return only properties mapped to definition
 * 
 * @param _obj base style or object that is being constructed.  If this is a style it will
 * be the style that is being built up.  If it is a state it will be the parent style
 * @param defaultDef default definition to use for default styles
 * @param allowPartial if true this is a state which is a partial or empty set of properties.
 * If false this should be a full object with all required props accounted for
 * @param definition Partial definition object that defines the changes to this style or the overrides
 * for the state
 * @param parent default style for a style variant or base style for a state
 */
export function resolveThemeDefinition(
  _obj: any,
  defaultDef: any,
  allowPartial: boolean,
  definition?: any,
  parent?: any
): any {
  if (allowPartial && !definition) {
    return definition;
  }
  const base = parent || defaultDef;
  return mergeObjects(base, definition);
}
