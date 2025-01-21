var express = require('express');
var path = require('path');
const cors = require('cors');
const listEndpoints = require('express-list-endpoints');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

var userRouter = require('./routes/user');
var agentRouter = require('./routes/agent');
var handicapRouter = require('./routes/handicap');
var reservationRouter = require('./routes/reservation');
var textRecognitionRouter = require('./routes/textrecognition'); // Nouvelle ligne

var app = express();
const db = require('./sql-database');

db.sequelize.sync({ alter: true })
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
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use('/api/user/', userRouter);
app.use('/api/agent/', agentRouter);
app.use('/api/handicap/', handicapRouter);
app.use('/api/reservation/', reservationRouter);
app.use('/api/textrecognition/', textRecognitionRouter); // Nouvelle ligne

app.get('/list-routes', (req, res) => {
  res.json(listEndpoints(app));
});
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;