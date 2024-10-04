var express = require('express');
var path = require('path')

var apiRouter = require('./routes/api');

var app = express();

app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', apiRouter);

module.exports = app;