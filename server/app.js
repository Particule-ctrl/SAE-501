var express = require('express');
var path = require('path');

var userRouter = require('./routes/user');

var app = express();

app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user/', userRouter);

module.exports = app;