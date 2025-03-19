require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogRouter");

const mongoUrl = process.env.MONGODB_URI;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("connected to DB."))
  .catch(() => console.log("error connecting to DB."));

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);

module.exports = app;
