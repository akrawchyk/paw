var config = require('./config');
var express = require('express');
var app = express();
var compression = require('compression');
var bodyParser = require('body-parser');

app.use(compression({ level: 9 }));
app.use(bodyParser.json());
app.set('port', config.get('PORT'));
app.use(express.static('public'));
require('./api/routes')(app);

if (config.get('NODE_ENV') === 'production') {
  app.use(function (req, res, next) {
    // force SSL on production
    // use req.headers.referrer !startsWith https
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  });
}

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('paw-api listening at http://%s:%s', host, port);
});
