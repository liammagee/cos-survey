import React from 'react';
import { Navigation } from '../components/navigation.jsx';

// Material UI options
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {green100, green500, green700} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  container: {
    textAlign: 'center',
    // paddingTop: 200,
  },
};
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: green100,
  },
}, {
  avatar: {
    borderColor: null,
  },
  //userAgent: req.headers['user-agent'],
});

export const App = ( { children } ) => (
  <MuiThemeProvider muiTheme={muiTheme} style={{color: muiTheme.palette.textColor}}>
    <div className="container" style={styles.container}>
      { children }
    </div>
  </MuiThemeProvider>
)
