const express = require("express");
const mongoose = require("mongoose");
//const redis = require("redis");
const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const {version} = require('../package.json')

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Konnect API Docs',
      version
    },
    components:{
      securitySchemas:
    }
  }
}


const { mongoConnection } = require("../configs/mongo");
const config = require("../configs/config");
const { errorConverter, errorHandler } = require("../middlewares/errorHandler");
const authRouter = require("../routes/auth.routes");
//const userRouter = require("../routes/user.routes");
//const groupRouter = require("../routes/group.routes");

// const redisClient = redis.createClient(6379);

// (async () => {
//   redisClient.on("error", (err) => {
//     console.log("Redis Client Error", err);
//   });
//   redisClient.on("ready", () => console.log("Redis is ready"));

//   await redisClient.connect();

//   await redisClient.ping();
// })();

app.use(express.json());
app.use(express.urlencoded());

app.use("/konnect/auth", authRouter);
//app.use("/konnect/user", userRouter);
//app.use("/konnect/group", groupRouter);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(errorConverter);
app.use(errorHandler);

const port = process.env.PORT;

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
