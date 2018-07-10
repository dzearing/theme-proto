import { IBaseState, IBaseLayer, IBaseSettings } from "../core/ICoreTypes";
import { createLayerOrState, adjustSettings, registerThemeModule } from "../core/ThemeModule";

export function registerStatesModule() {
  registerThemeModule({
    name: 'states',
    resolveDef: resolveStates,
    updateSettings: addStatesToStyle
  })
}

function resolveStates(
  _name: string,
  newStyle: any,
  _defaultDef: object,
  _allowPartial: boolean,
  def?: { [key: string]: IBaseState },
  _parent?: IBaseLayer
): any {
  if (def) {
    return Object.keys(def).reduce((obj, key) => {
      const stateDef = def![key];
      obj[key] = createLayerOrState(stateDef, true, newStyle);
      return obj;
    }, {});
  }
  return undefined;
}

const selectorsKey = 'selectors';

function addStatesToStyle(style: IBaseSettings, states: object, params?: object): IBaseSettings {
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
      selectors![key] = adjustSettings(styleForState, selectors![key], styleForState, params as { [key: string]: object });
    }
  }
  return style;
}