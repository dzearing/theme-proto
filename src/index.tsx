import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { IStyleProps } from './createComponent';
// import { ThemeProvider } from './theming/ThemeProvider';
import { Button } from './Button';
import Card from './Card';
import { Configurator } from './Configurator';
import { ThemeConsumer } from './theming/ThemeProvider';
import { ITheme } from './theming/ITheme';


// loadTheme(GlobalTheme);



// const CustomTheme = createTheme({
//   palette: {},
//   componentStyles: {
//     Button: {
//       root: 'Product-Button'
//     }
//   }

// });

ReactDOM.render(
  <div>
    <ThemeConsumer>{(theme: ITheme) => {
      return (<Configurator theme={theme} />);
    }}</ThemeConsumer>

    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>

      <Card>
        <Button text='Normal button' />
        <Button primary text='Primary button' />
      </Card>

      <Card paletteSet='primary'>
        <Button text='Normal button' />
        <Button paletteSet='default' primary text='Primary button' />
      </Card>

    </div>
  </div>
  ,
  document.getElementById('root') as HTMLElement
);
