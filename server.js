const express = require("express");
const app = express();

const { mongoConnection } = require("./configs/mongo.configs");
const { errorHandler } = require("./middlewares/errorHandler");
const { notFound } = require("./middlewares/notFound");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const chatRouter = require("./routes/chats.routes");
const postRouter = require("./routes/posts.routes");
const groupRouter = require("./routes/groups.routes");

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/posts", postRouter);
app.use("/api/groups", groupRouter);

app.use(notFound);
app.use(errorHandler);

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
