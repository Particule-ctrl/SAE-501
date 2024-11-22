var express = require('express');
var path = require('path');
const cors = require('cors');
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

const allowedOrigins = ['http://localhost:8081', 'http://localhost:8082', 'http://localhost:19006', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow requests from allowed origins
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use('/api/user/', userRouter);

module.exports = app;