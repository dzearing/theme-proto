import { registerThemeModule } from "../ThemeModule";

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
  registerThemeModule({
    name: 'values',
    default: DefaultStyleValues
  })
}

