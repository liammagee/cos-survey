import { Mongo } from 'meteor/mongo';

export const Assessments = new Mongo.Collection('assessments');

Assessments.schema = new SimpleSchema({
  text: {type: String},
  createdAt: {type: Date},
  ratings: {type: [Number], defaultValue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]}
});
