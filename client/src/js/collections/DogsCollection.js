var Backbone = require('backbone');

var Dog = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    in_office: false
  },
  url: '/api/dog'
});

var Dogs = Backbone.Collection.extend({
  model: Dog,
  url: '/api/dogs',
  initialize: function() {
    this.fetch();
  }
});

module.exports = Dogs;
