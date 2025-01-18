const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Version of OpenAPI
    info: {
      title: 'PMR Api', // Title for your API
      version: '1.0.0', // Version of your API
      description: 'API documentation using Swagger', // Description
    },
    servers: [
      {
        url: process.env.PORT, // API server base URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to API documentation comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
