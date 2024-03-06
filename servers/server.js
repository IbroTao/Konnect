const express = require("express");
const mongoose = require("mongoose");
//const redis = require("redis");
const app = express();
const swaggerUI = require("swagger-ui-express");

const { mongoConnection } = require("../configs/mongo");
const config = require("../configs/config");
const { errorConverter, errorHandler } = require("../middlewares/errorHandler");
const authRouter = require("../routes/auth.routes");

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
