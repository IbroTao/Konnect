const express = require("express");
const app = express();
const port = process.env.PORT;
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { version } = require("../package.json");
const log = require("../configs/logger");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Konnect API Docs",
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["../routes/*.js", "..routes/community/*.js"],
};

const swaggerSpecs = swaggerJsDoc(options);

function swaggerDocs(app, port) {
  // Swagger Format
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

  // Docs in JSON Format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecs);
  });

  log.info(`Docs available at http://localhost:${port}/docs`);
}

module.exports = { swaggerDocs };
