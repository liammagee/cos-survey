import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { Assessments } from '../../api/assessments.js';

import Assessment from '../components/Assessment.jsx';


// App component - represents the whole app
class Summary extends Component {

  renderAssessmentSummary() {
    let a = new Assessment();
    let rs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ];
    this.props.assessments.map((assessment) => {

      let r = assessment.ratings;
      for (let i = 0; i < r.length; i++) {
        rs[i] += r[i];
      }
    });
    if (this.props.assessments.length > 0) {
      for (let i = 0; i < rs.length; i++) {
        rs[i] /= this.props.assessments.length;
        rs[i] = Math.round(rs[i]);
      }
      a.ratings = rs;
      console.log(a.ratings);
      return <Assessment key={-1} assessment={a} router={this.props.router} isInteractive={false} />
    }
    else {
      return('')
    }
  }

  render() {
    return (
      <div>
        <header>
          <h1>Thank you for completing the Circles of Social Life survey!</h1>
        </header>

        {this.renderAssessmentSummary()}

        <Link to="/" activeClassName="active">Return home</Link>
      </div>
    );
  }
}


Summary.propTypes = {
  assessments: PropTypes.array.isRequired,
};


export default createContainer(() => {
  return {
    assessments: Assessments.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, Summary);
