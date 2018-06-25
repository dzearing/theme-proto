import { resolveDefinitions, handleStringChange } from "../modules/ThemeModule";
import { mergeObjects } from "./mergeObjects";
import { hasTheme, getThemeCore } from "./ThemeRegistry";

const stylesKey = 'styles';
const statesKey = 'states';
const defKey = 'definition';
const defaultName = 'default';

/**
 * Core theme creation function
 * @param definition settings for the new theme to create
 * @param parentTheme optional parent theme to use as a baseline.  Primarily used for creating
 * runtime theme overrides
 */
export function createThemeCore(definition: object, parentTheme?: object): object {
  // start with the base style definition
  const baseStyle = resolveDefinitions(definition, false, parentTheme);
  const newDef = parentTheme && parentTheme.hasOwnProperty(defKey)
    ? mergeObjects(parentTheme[defKey], definition)
    : definition;
  const styleDefinitions = newDef.hasOwnProperty(stylesKey) ? newDef[stylesKey] : {};

  return {
    ...baseStyle,
    definition: newDef,
    styles: Object.keys(styleDefinitions).reduce((styles, styleName) => {
      styles[styleName] = () => {
        const styleDef = styleDefinitions[styleName];
        const newStyle = resolveDefinitions(styleDef, false, baseStyle);
        return {
          ...newStyle,
          states: createStatesForStyle(newStyle, styleDef[statesKey])
        }
      }
      return styles;
    }, {}),
    states: createStatesForStyle(baseStyle, newDef[statesKey])
  };
}

/*
  generate a theme settings interface from an update string.  Possible options:
    theme: <name>                       - set the theme with the specified name as active
    type: [themed|bg|switch]             - adjust the type of the default layer as specified
    deepen: number                      - adjust the current shade by the specified number of levels
    shade: number                       - set the current shade to the specified value
    fg|bg|accent: color                 - override the seed colors for the theme
*/
export function themeFromChangeStringCore(update: string, baseline: object): object {
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
export function getThemeStyleCore(theme: object, name?: string): object {
  const styles = theme[stylesKey];
  if (name && name !== defaultName && styles.hasOwnProperty(name)) {
    if (typeof styles[name] === 'function') {
      // if this is a factory function call the function to resolve the style
      styles[name] = styles[name]();
    }
    return styles[name];
  }
  // failing a name lookup (or if we just want the default) return the base theme
  return theme;
}

function createStatesForStyle(baseStyle: object, stateDefinitions?: object) {
  if (stateDefinitions) {
    return Object.keys(stateDefinitions).reduce((obj, key) => {
      const stateDef = stateDefinitions[key];
      obj[key] = resolveDefinitions(stateDef, true, baseStyle);
      return obj;
    }, {});
  }
  return {};
}