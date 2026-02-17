// docs/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Isimo Weather API",
      version: "1.0.0",
      description: "API documentation for Isimo Weather Platform",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5000}` },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
