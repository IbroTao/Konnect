const express = require("express");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const app = express();

const config = require("../configs/config");
const { errorConverter, errorHandler } = require("../middlewares/errorHandler");
const authRouter = require("../routes/auth.routes");

app.use(express.json());
app.use(express.urlencoded());
app.use(errorConverter);
app.use(errorHandler);

app.use("/konnect/auth", authRouter);

const port = process.env.PORT;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Konnect API Docs",
      description:
        "A web social platform that ensure seamless communication between people",
      contact: {
        name: "Taofeek",
      },
      servers: ["http://localhost:9090"],
    },
    schemes: ["http", "https"],
  },
  apis: ["../routes/*.routes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const runApp = (port) => {
  mongoose
    .connect(config.mongoose.url, config.mongoose.options)
    .then((res) => {
      app.listen(port);
      console.log(`App is running on PORT ${port}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
runApp(port);
