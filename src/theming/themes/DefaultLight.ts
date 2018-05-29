import { DefaultPalette as palette } from './DefaultPalette';
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

  palette,
  fonts,
  fontWeights,
  paletteSets: {

    default: {
      background: 'white',
      text: 'black',
      link: 'themePrimary',
      linkVisited: 'themePrimary'
    },

    primary: {
      background: 'themePrimary',
      text: 'white',
      link: 'white',
      linkVisited: 'white'
    },

    neutral: {
      background: 'neutralTertiaryAlt',
      text: 'black',
      link: 'white',
      linkVisited: 'white'
    }
  }

};

export default LightTheme;
