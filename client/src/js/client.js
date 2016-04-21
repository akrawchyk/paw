/* global gapi */

var Backbone = require('backbone');
var jQuery = require('jquery');
Backbone.$ = jQuery;
var _ = require('lodash');
_.templateSettings.imports = {
    __webpack_require__: __webpack_require__
};
var WebFont = require('webfontloader');
var app = require('./app');
var auth = require('imports?this=>window!exports?window.clientInit&window.onGAPILoadCallback!./auth')


WebFont.load({
  typekit: {
    id: 'nki8bkd'
  }
});

