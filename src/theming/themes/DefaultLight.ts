import { IThemeSettings } from '../ITheme';
import { defaultThemeOffsets } from '../IThemeDefinition';
import { DefaultFonts as fonts, DefaultFontWeights as fontWeights } from './DefaultFonts';

export const LightTheme: IThemeSettings = {
  seedColors: {
    fg: 'black',
    bg: 'white',
    accent: '#0078d4'
  },

  offsets: defaultThemeOffsets,

  fonts,
  fontWeights

};

export default LightTheme;
