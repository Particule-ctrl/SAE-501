var express = require('express');
var router = express.Router();
const db = require('../sql-database');
const {startConsumer,sendMessage, initProducer} = require('../kafka')
const path = require('path');
const { stringify } = require('querystring');

router.use(express.json());

initProducer().catch((err) => {
  console.error('Error initializing Kafka producer:', err);
});


// Route to produce a message
router.post('/produce', async (req, res) => {
  const { message, userId } = req.body;
  try {
    await sendMessage(userId, message);
    res.status(200).send('Message sent to Kafka');
  } catch (err) {
    console.error('Error producing message', err);
    res.status(500).send('Failed to send message');
  }
});

router.post('/consume', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: Consumer started\n\n');

  try {
    // Start the Kafka consumer and push events as messages are consumed
    await startConsumer((message) => {
        // Send the consumed message to the client in real-time using SSE
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    }, req.body.userId);
} catch (err) {
    console.error('Error starting the consumer', err);
    res.status(500).send('Failed to start the consumer');
}

});
module.exports = router;