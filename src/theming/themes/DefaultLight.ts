import { createTheme } from '../createTheme';
import { DefaultPalette as palette } from './DefaultPalette';

export const LightTheme = createTheme({
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

});

export default LightTheme;
