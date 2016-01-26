var fs = require('fs');
var _ = require('underscore');
var Backbone = require('backbone');
var DashboardDogsListDogViewTemplate = fs.readFileSync(__dirname + '/DashboardDogsListDogViewTemplate.html', 'utf8');

var DashboardDogsListDogView = Backbone.View.extend({
  template: _.template(DashboardDogsListDogViewTemplate),

  events: {
    'change [name="checked_in"]': 'handleCheckedInChange',
    'change [type="radio"]' : 'statusChange'
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    console.log(this.model.attributes);
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  handleCheckedInChange: function(e) {
    this.model.set('checked_in', e.target.checked);
    this.render();
  },

  statusChange: function(e) {
    console.log('radio button has been changed');
  }
});

module.exports = DashboardDogsListDogView;
