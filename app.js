require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogRouter = require("./controllers/blogRouter");
const usersRouter = require("./controllers/usersRouter");
const errorHandler = require("./middleware/errorHandler");

const mongoUrl = config.MONGODB_URI;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("connected to DB."))
  .catch(() => console.log("error connecting to DB."));

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

app.use(errorHandler);

module.exports = app;
