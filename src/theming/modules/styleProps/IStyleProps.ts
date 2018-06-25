import { registerThemePlugIn } from "../ThemePlugin";

/**
 * Various non-color properties that can be referenced by the theming system
 */
export interface IStyleValues {
  /**
   * Border thickness
   */
  borderThickness?: number;
  /**
   * Corner radius
   */
  cornerRadius?: number;
}

export const DefaultStyleValues: IStyleValues = {
}

export function registerStylePropsModule() {
  registerThemePlugIn({
    name: 'values',
    default: DefaultStyleValues
  })
}

