import { DefaultFonts, DefaultFontWeights } from './DefaultFonts';
import { IThemeStyle } from '../IThemeStyle';
import { IThemeSettings } from '../IThemeSettings';

export const styleBaseline: IThemeStyle = {
  key: { type: 'bg', shade: 0 },
  fonts: DefaultFonts,
  fontWeights: DefaultFontWeights,
}

export const LightTheme: IThemeSettings = {
  seeds: {
    fg: 'black',
    bg: 'white',
    accent: '#0078d4',
    useBgForTone: true,
    invert: false
  },
  styles: {
    default: styleBaseline,
    shadedControl: {
      key: { type: 'rel', shade: 2 }
    },
    themedControl: {
      key: { type: 'switch', shade: 0 }
    },
    hovered: {
      key: { type: 'rel', shade: 2 }
    },
    pressed: {
      key: { type: 'rel', shade: 3 }
    }
  }
};



export default LightTheme;
