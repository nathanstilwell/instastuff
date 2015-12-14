'use strict';

var appRoot = __dirname;

var express = require('express');
var app = express();
var port = 9999;

app.set('port', (process.env.PORT || port));
app.use(express.static(appRoot + '/public'));

app.listen(app.get('port'), function() {
  process.stdout.write('App is running the ' + (process.env.NODE_ENV || 'development') + ' environment on port ' + app.get('port') + '\n');
});

