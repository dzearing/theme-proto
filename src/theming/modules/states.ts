import { IBaseState, IBaseStyle } from "../core/baseStructure";
import { createStyleOrState, adjustStyleProps, registerThemeModule } from "../core/ThemeModule";
import { IRawStyle } from "@uifabric/styling";

export function registerStatesModule() {
  registerThemeModule({
    name: 'states',
    resolveDef: resolveStates,
    updateStyle: addStatesToStyle
  })
}

function resolveStates(
  _name: string,
  newStyle: any,
  _defaultDef: object,
  _allowPartial: boolean,
  def?: { [key: string]: IBaseState },
  _parent?: IBaseStyle
): any {
  if (def) {
    return Object.keys(def).reduce((obj, key) => {
      const stateDef = def![key];
      obj[key] = createStyleOrState(stateDef, true, newStyle);
      return obj;
    }, {});
  }
  return undefined;
}

const selectorsKey = 'selectors';

function addStatesToStyle(style: IRawStyle, states: object, params?: object): IRawStyle {
  if (!style[selectorsKey]) {
    style[selectorsKey] = {};
  }
  const selectors = style[selectorsKey];
  for (const key in states) {
    if (states.hasOwnProperty(key)) {
      if (!selectors![key]) {
        selectors![key] = {};
      }
      const styleForState = states[key];
      selectors![key] = adjustStyleProps(styleForState, selectors![key] as IRawStyle, styleForState, params as { [key: string]: object });
    }
  }
  return style;
}