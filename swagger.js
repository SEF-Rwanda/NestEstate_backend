const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    swagger: "2.0",
    info: {
      title: "NestEstate API",
      version: "1.0.0",
      description: "Real estate",
      termsOfService: "http://swagger.io/terms/",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000/",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
