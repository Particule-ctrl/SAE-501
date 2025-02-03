const { Kafka } = require('kafkajs');
const { use } = require('./app');

const kafka = new Kafka({
    clientId: 'express-app',
    brokers: ['broker:9092'], // Replace with your Kafka broker addresses
});
// Kafka Producer
let producer;
const initProducer = async () => {
    producer = kafka.producer();
    console.log('Kafka Producer connected');
};

// Kafka Consumer
const consumer = kafka.consumer({ groupId: 'notification-group' });

const startConsumer = async (messageCallback, userId) => {
    await consumer.connect();
    console.log('Consumer connected');
    
    // Subscribe to the topic
    await consumer.subscribe({ topic: 'user-events', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const userIdkey = message.key.toString(); // The key is the userId
            const eventMessage = message.value.toString();

            console.log(`Received message for user ${userIdkey}: ${eventMessage}`);

            // Call the provided callback function to push the message to the client
            if (userId.toString()===userIdkey){
                messageCallback({ userIdkey, eventMessage });
            }
        },
    });
};


// Send a message to Kafka (producer)
const sendMessage = async (userId, message) => {
    await producer.connect();
    try {
        await producer.send({
            topic: 'user-events', // Topic name
            messages: [
                {
                    key: userId.toString(), // Use userId as key for Kafka partitioning
                    value: message,         // The event message
                },
            ],
        });
        console.log(`Message sent for user ${userId}`);
    } catch (err) {
        console.error('Error sending message', err);
    }
};

module.exports = {
    initProducer,
    startConsumer,
    sendMessage,
    producer
};
