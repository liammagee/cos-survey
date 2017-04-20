import { Mongo } from 'meteor/mongo';

export const Projects = new Mongo.Collection('projects');

export const Subdomains = new Mongo.Collection('subdomains');

export const Domains = new Mongo.Collection('domains');

export const Assessments = new Mongo.Collection('assessments');

Subdomains.schema = new SimpleSchema({
  label: {type: String},
  domain: {type: String},
  createdAt: {type: Date}
});

Domains.schema = new SimpleSchema({
  name: {type: String},
  subdomains: {
      type: String
  }
});

Assessments.schema = new SimpleSchema({
  text: {type: String},
  createdAt: {type: Date},
  ratings: {type: [Number], defaultValue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]}
});


Projects.schema = new SimpleSchema({
  text: {type: String},
  createdAt: {type: Date},
  assessments: {
     type: [Assessments],
     label: "assessments"
  },
  domains: {
      type: [Domains],
      label: "domains",
      autoValue: function() {
        return [
            { name: 'Economics', subdomains: ["Short-termism", "Future of work", "Gentrification & affordability", "Insecure, low employment", "Education", "Funding health services", "Youth as assets"] },

            { name: 'Ecology', subdomains: ["Green spaces", "Ecological new developments", "Sustainable living", "Public transport", "Energy efficiency", "Environmental sustainability", "Digital spaces & capacities"] },

            { name: 'Culture', subdomains: ["Problematising Youth", "Options for Health & Wellbeing", "Intergenerational knowledge", "Disparity of opportunities", "Negative stigma in mental health", "High density living", "Gentrification"] },

            { name: 'Politics', subdomains: ["Will for alternative housing", "Youth influence", "Youth-friendly services", "Intergenerational tensions", "Agenda-setting bias", "Lightweight consultation", "Planning laws"        ] }
        ]
      }
  },
});
