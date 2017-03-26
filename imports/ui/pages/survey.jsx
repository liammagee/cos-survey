import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { Assessments } from '../../api/assessments.js';

import Assessment from '../components/Assessment.jsx';


// App component - represents the whole app
class SurveyComponent extends Component {
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Assessments.insert({
      text,
      createdAt: new Date(), // current time
      ratings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderAssessments() {
    return this.props.assessments.map((assessment) => (
      <Assessment key={assessment._id} assessment={assessment} router={this.props.router} isInteractive={true} />
    ));
  }

  render() {
    return (
      <div>
        <header>
          <h1>Profile your area or project on the dimensions of Social Life. </h1>

           <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
             <input
               type="text"
               ref="textInput"
               placeholder="Type a title for your new profile."
             />
           </form>
        </header>

        <ul>
          {this.renderAssessments()}
        </ul>

      </div>
    );
  }
}


SurveyComponent.propTypes = {
  assessments: PropTypes.array.isRequired,
  router: PropTypes.object.isRequired,
};


export default Survey = createContainer(() => {
  return {
    assessments: Assessments.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, SurveyComponent);
