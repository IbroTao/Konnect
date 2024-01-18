const express = require("express");
const app = express();

const { mongoConnection } = require("./configs/mongo.configs");

app.use(express.json());
app.use(express.urlencoded());

const port = process.env.PORT;

const runApp = (port) => {
  mongoConnection()
    .then((res) => {
      app.listen(port);
      console.log(`App is running on PORT ${port}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
runApp(port);
