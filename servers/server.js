const express = require("express");
const mongoose = require("mongoose");
const app = express();

const { mongoConnection } = require("../configs/mongo");
const config = require("../configs/config");
const { errorConverter } = require("../middlewares/errorHandler");
const authRouter = require("../routes/auth.routes");

app.use(express.json());
app.use(express.urlencoded());

app.use("/konnect/auth", authRouter);

app.use(errorConverter);

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
