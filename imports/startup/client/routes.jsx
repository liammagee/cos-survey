import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { App } from '../../ui/layouts/app.jsx';

import { Index } from '../../ui/pages/index.jsx';
import { NotFound } from '../../ui/pages/not-found.jsx';
import Survey from '../../ui/pages/survey.jsx';
import Summary from '../../ui/pages/summary.jsx';

Meteor.startup( () => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute component={ Index } />
        <Route path="/survey" component={ Survey } />
        <Route path="/summary" component={ Summary } />
      </Route>
      <Route path="*" component={ NotFound } />
    </Router>,
    document.getElementById( 'react-root' )
  );
});
