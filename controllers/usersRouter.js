const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  //validate password
  if (password.length < 3) {
    const error = new Error(
      "Password length must be greater at least 3 characters long.",
    );
    error.status = 400;
    return next(error);
  }

  if (!password) {
    const error = new Error("invalid password.");
    error.status = 400;
    return next(error);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
