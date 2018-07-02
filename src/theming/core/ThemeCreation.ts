import { createStyleOrState, handleStringChange } from "../core/ThemeModule";
import { mergeObjects } from "./mergeObjects";
import { hasTheme, getThemeCore } from "./ThemeRegistry";
import { IBaseTheme, IBaseStyle, IBaseThemeDefinition } from "./baseStructure";

const stylesKey = 'styles';
const defKey = 'definition';
const defaultName = 'default';

/**
 * Core theme creation function
 * @param definition settings for the new theme to create
 * @param parentTheme optional parent theme to use as a baseline.  Primarily used for creating
 * runtime theme overrides
 */
export function createThemeCore(definition: IBaseThemeDefinition, parentTheme?: IBaseTheme): object {
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

function aggregateStyleDefinition(styleDefinitions: IBaseStyle, styleName: string): any {
  if (styleDefinitions.hasOwnProperty(styleName)) {
    const styleDef = styleDefinitions[styleName];
    if (styleDef.parent) {
      return mergeObjects(aggregateStyleDefinition(styleDefinitions, styleDef.parent), styleDef);
    }
    return styleDef;
  }
}

/*
  generate a theme settings interface from an update string.  Possible options:
    theme: <name>                       - set the theme with the specified name as active
    type: [themed|bg|switch]             - adjust the type of the default layer as specified
    deepen: number                      - adjust the current shade by the specified number of levels
    shade: number                       - set the current shade to the specified value
    fg|bg|accent: color                 - override the seed colors for the theme
*/
export function themeFromChangeStringCore(update: string, baseline: IBaseTheme): IBaseTheme {
  const terms = update.split(' ');
  const definition = {};
  let updated = false;

  for (let i: number = 0; i < terms.length; i++) {
    const cmd = terms[i];
    const param = (i + 1) < terms.length ? terms[i + 1] : undefined;

    if (cmd === 'theme:' && param) {
      if (hasTheme(param)) {
        return getThemeCore(param);
      }
    } else {
      const handledTerms = handleStringChange(baseline, definition, cmd, param);
      if (handledTerms > 0) {
        updated = true;
        i += (handledTerms - 1);
      }
    }
  }

  return updated ? createThemeCore(definition, baseline) : baseline;
}

/**
 * Get a resolved style from the theme.  If it was not already resolved this will make sure it gets
 * resolved.
 * @param theme Theme from which to obtain the style
 * @param name Name of the style to obtain.  If undefined it is the equivalent of default
 */
export function getThemeStyleCore(theme: IBaseTheme, name?: string): IBaseStyle {
  const styles = theme.styles;
  if (styles && name && name !== defaultName && styles.hasOwnProperty(name)) {
    const styleVal = styles[name];
    if (typeof styleVal === 'function') {
      // if this is a factory function call the function to resolve the style
      styles[name] = styleVal();
    }
    return styles[name] as IBaseStyle;
  }
  // failing a name lookup (or if we just want the default) return the base theme
  return theme;
}
