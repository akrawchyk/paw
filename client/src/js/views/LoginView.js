/* global gapi */

var _ = require('lodash');
var Backbone = require('backbone');
var app = require('../app');
var loginTemplate = require('./LoginTemplate.html');
var loggedTemplate = require('./LoggedTemplate.html');

var LoginView = Backbone.View.extend({
  initialize: function() {
    this.render = _.bind(this.render, this);
    this.render();
    app.session.on('change:logged', this.render);
  },

  events: {
    'click #auth2-signin': 'handleLogin',
    'click #auth2-signout': 'handleLogout'
  },

  render: function() {
    if (app.session.get('logged')) {
      console.log('logout rendered');
      this.template = loggedTemplate;
    } else {
      console.log('login rendered');
      this.template = loginTemplate;
    }

    this.$el.html(this.template({
      user: JSON.stringify(app.session.user.toJSON())
    }));

    return this;
  },

  handleLogin: function() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(function() {
      app.session.checkAuth({
        success: function() {
          // TODO welcome back message?
          app.clearErrors();
        },
        error: function() {
          // attempted login but was not allowed
          app.error('You must be an ISL employee to login... (._.) ( l: ) ( .-. ) ( :l ) (._.)');
          auth2.disconnect();
        }
      });
    });
  },

  handleLogout: function() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
  }
});

module.exports = LoginView;
