import React from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export const Index = () => <div>
  <AppBar title="My AppBar" />

  <header>
    <h1>Welcome to the <em>Circles of Social Life</em> Assessment tool. </h1>
  </header>

  <p>
    This survey is designed to help
    <em>[Information about the Circles survey].
    </em>
  </p>

  <p>
    [Participant Information Sheet]
  </p>

  <p>
    If you would like to participate in the survey,
    please <Link to="/survey" activeClassName="active">click here</Link> to continue.
  </p>

  <RaisedButton label="Default" />


</div>;
