import { IBaseState, IBaseStyle, IStyleProps } from "../core/ICoreTypes";
import { createStyleOrState, adjustStyleProps, registerThemeModule } from "../core/ThemeModule";

export function registerStatesModule() {
  registerThemeModule({
    name: 'states',
    resolveDef: resolveStates,
    updateProps: addStatesToStyle
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

function addStatesToStyle(style: IStyleProps, states: object, params?: object): IStyleProps {
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
      selectors![key] = adjustStyleProps(styleForState, selectors![key], styleForState, params as { [key: string]: object });
    }
  }
  return style;
}