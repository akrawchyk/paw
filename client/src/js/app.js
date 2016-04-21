var _ = require('lodash');
var $ = require('jquery');
var errorTemplate = require('./views/ErrorTemplate.html');

var app = {};

app.error = function(message) {
  var template = errorTemplate;
  template = template({
    message: message
  });
  $(template).hide().appendTo('#paw-app #messages').slideDown(function() {
    var self = this;
    setTimeout(function() {
      $(self).slideUp(function() {
        $(this).remove();
      });
    }, process.env.ERROR_DISPLAY_TIMEOUT_MS);
  });
};

app.clearErrors = function() {
  $('#paw-app #messages').children().slideUp(function() {
    $(this).remove();
  });
};

module.exports = app;
