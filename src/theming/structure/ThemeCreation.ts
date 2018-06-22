import { mergeObjects } from "../ThemeRegistry";
import { resolveDefinitions } from "../plugins/ThemePlugin";

const stylesKey = 'styles';
const statesKey = 'states';
const defKey = 'definition';
const defaultName = 'default';

export function createTheme(definition: object, parentTheme?: object): object {
  // start with the base style definition
  const baseStyle = resolveDefinitions(definition, false, parentTheme);
  const newDef = parentTheme && parentTheme.hasOwnProperty(defKey)
    ? mergeObjects(parentTheme[defKey], definition)
    : definition;
  const styleDefinitions = newDef.hasOwnProperty(stylesKey) ? newDef[stylesKey] : {};

  return {
    ...baseStyle,
    definition: newDef,
    styles: {
      ...Object.keys(styleDefinitions).map((key: string) => {
        // return a function that will create the style on demand when requested
        () => {
          const styleDef = styleDefinitions[key];
          const newStyle = resolveDefinitions(styleDef, false, baseStyle);
          return {
            ...newStyle,
            states: createStatesForStyle(newStyle, styleDef[statesKey])
          }
        }
      })
    },
    states: createStatesForStyle(baseStyle, newDef[statesKey])
  };
}

export function getThemeStyle(theme: object, name?: string): object {
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
    return {
      ...Object.keys(stateDefinitions).map((key: string) => {
        const stateDef = stateDefinitions[key];
        return resolveDefinitions(stateDef, true, baseStyle);
      })
    }
  }
  return {};
}