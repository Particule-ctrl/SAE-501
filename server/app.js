var express = require('express');
var path = require('path');

var userRouter = require('./routes/user');

var app = express();
const db = require('./sql-database'); // Adjust path as necessary

db.sequelize.sync({ alter: true }) // Adjust 'force: true' or 'alter: true' depending on your needs
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing the database:', err);
  });

app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user/', userRouter);

module.exports = app;