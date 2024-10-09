var express = require('express');
var path = require('path');

var pmrRouter = require('./routes/pmr');

var app = express();

app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/pmr/', pmr);

module.exports = app;