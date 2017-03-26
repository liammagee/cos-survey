import React from 'react';
import { Link } from 'react-router';

export const Index = () => <div>
  <header>
    <h1>Welcome to the Circles of Social Life Survey</h1>
  </header>

  <div>
    This survey is designed to help
    <em>[Information about the Circles survey].
    </em>
  </div>

  <div>
    [Participant Information Sheet]
  </div>

  <div>
    If you would like to participate in the survey,
    please <Link to="/survey" activeClassName="active">click here</Link> to continue.
  </div>

</div>;
