const path = require('path');
const config = require('./config').get();
const webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: './client/src/js/client.js',
  output: {
    path: './public',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.html$/, loader: 'underscore-template', query: { engine: 'lodash', attributes: ['img:src', 'object:data'] }},
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
      { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url?limit=10000&name=[name].[ext]' }
    ]
  },
  resolve: {
    alias: {
      'underscore': 'lodash',
      'eventEmitter/EventEmitter': 'wolfy87-eventemitter/EventEmitter',
      'get-style-property/get-style-property': 'desandro-get-style-property/get-style-property',
      'matches-selector/matches-selector': 'desandro-matches-selector/matches-selector',
      'classie/classie': 'desandro-classie/classie'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      // Automtically detect jQuery and $ as free var in modules
      // and inject the jquery library
      // This is required by many jquery plugins
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'DOGS_POLLING_INTERVAL_MS': JSON.stringify(config.DOGS_POLLING_INTERVAL_MS),
        'GAPI_CLIENT_ID': JSON.stringify(config.GAPI_CLIENT_ID)
      }
    }),
    new webpack.optimize.DedupePlugin()
    // new webpack.optimize.UglifyJsPlugin()
  ],
  sassLoader: {
    includePaths: [
      path.join(path.dirname(require.resolve('foundation-sites')), '../scss'),
      path.join(path.dirname(require.resolve('flickity')), '../css')
    ]
  },
  postcss: function () {
    return [autoprefixer];
  }
}
