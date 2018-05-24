import { DefaultPalette as palette } from './DefaultPalette';
import { IThemeSettings } from '../ITheme';

export const LightTheme: IThemeSettings = {
  fg: 'black',
  bg: 'white',
  accent: 'blue',

  palette,
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
