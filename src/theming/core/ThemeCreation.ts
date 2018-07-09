import { createStyleOrState } from "./ThemeModule";
import { mergeObjects } from "./mergeObjects";
import { IBaseTheme, IBaseStyle, IBaseStyleDef, IBaseThemeDef } from "./ICoreTypes";

const stylesKey = 'styles';
const defKey = 'definition';
const defaultName = 'default';

/**
 * Core theme creation function
 * @param definition settings for the new theme to create
 * @param parentTheme optional parent theme to use as a baseline.  Primarily used for creating
 * runtime theme overrides where the theme definition is only partially specified
 */
export function createThemeCore<IThemeDef extends IBaseThemeDef, ITheme extends IBaseTheme>(
  definition: IThemeDef,
  parentTheme?: ITheme
): ITheme {
  // start with the base style definition
  const baseStyle = createStyleOrState(definition, false, parentTheme);
  const newDef = parentTheme && parentTheme.hasOwnProperty(defKey)
    ? mergeObjects(parentTheme[defKey], definition)
    : definition;
  const styleDefinitions = newDef.hasOwnProperty(stylesKey) ? newDef[stylesKey] : {};
  const baseStateDef = newDef.states || {};

  return {
    ...baseStyle,
    definition: newDef,
    styles: Object.keys(styleDefinitions).reduce((styles, styleName) => {
      styles[styleName] = () => {
        const base = { states: baseStateDef };
        const styleDef = mergeObjects(base, aggregateStyleDefinition(styleDefinitions, styleName));
        return createStyleOrState(styleDef, false, baseStyle);
      }
      return styles;
    }, {}),
  };
}

function aggregateStyleDefinition<IThemeStyleDefinition extends IBaseStyleDef>(
  styleDefinitions: { [key: string]: Partial<IThemeStyleDefinition> },
  styleName: string
): Partial<IThemeStyleDefinition> {
  if (styleDefinitions.hasOwnProperty(styleName)) {
    const styleDef = styleDefinitions[styleName];
    if (styleDef.parent) {
      return mergeObjects(aggregateStyleDefinition(styleDefinitions, styleDef.parent!), styleDef);
    }
    return styleDef;
  }
  return {};
}

/**
 * Get a resolved style from the theme.  If it was not already resolved this will make sure it gets
 * resolved.
 * @param theme Theme from which to obtain the style
 * @param name Name of the style to obtain.  If undefined it is the equivalent of default
 */
export function getThemeStyleCore<ITheme extends IBaseTheme & IStyle, IStyle extends IBaseStyle>(
  theme: ITheme,
  name?: string
): IStyle {
  const styles = theme.styles;
  if (styles && name && name !== defaultName && styles.hasOwnProperty(name)) {
    const styleVal = styles[name];
    if (typeof styleVal === 'function') {
      // if this is a factory function call the function to resolve the style
      styles[name] = styleVal();
    }
    return styles[name] as IStyle;
  }
  // failing a name lookup (or if we just want the default) return the base theme, which extends IStyle by definition
  return theme;
}
