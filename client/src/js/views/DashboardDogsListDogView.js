var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var dashboardDogsListDogTemplate = require('./DashboardDogsListDogTemplate.html');

var DashboardDogsListDogView = Backbone.View.extend({
  template: dashboardDogsListDogTemplate,

  events: {
    'click .button--check-in': 'handleCheckedInChange',
    'change [type="radio"]' : 'statusChange',
    'click .dropdown' : 'toggleDropdown'
  },

  initialize: function() {
    this.render();
    this.listenTo(this.model, 'change:current_status', this.render);
  },

  render: function() {

    var verboseStatus = this.model.setVerboseStatus();

    var renderedObj =  _.extend({}, this.model.toJSON(), {
      current_status_label: verboseStatus[0],
      current_status_color: verboseStatus[1]
    });

    this.$el.html(this.template(renderedObj));

    return this;
  },

  handleCheckedInChange: function() {
    this.model.checkIn();
    this.render();
    console.log('dog checked in');
  },

  statusChange: function(e) {
    var val = $(e.target).val();
    this.model.set('current_status', val);
    this.toggleDropdown();
    this.render();
    console.log('radio button has been changed');
  },

  toggleDropdown: function() {
    this.$el.find('.dropdown').toggleClass('dropdown--open');
    console.log('dropdown toggled');
  }
});

module.exports = DashboardDogsListDogView;
