const blogRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const getTokenFrom = require("../utils/token_helper");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogRouter.post("/", async (request, response, next) => {
  const body = request.body;
  let decodedToken;

  try {
    decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      const error = new Error("token invalid");
      error.name = "JsonWebTokenError";
      error.status = 401;
      throw error;
    }
  } catch (error) {
    return next(error);
  }

  const foundUser = await User.findById(decodedToken.id);

  const blogData = {
    title: body.title,
    author: body.author,
    likes: body.likes || 0,
    url: body.url,
    user: foundUser.id,
  };

  //save the blog
  const blog = new Blog(blogData);
  const result = await blog.save();

  //update the user's blog list
  foundUser.blogs = foundUser.blogs.concat(result.id);
  const updatedUser = await foundUser.save();

  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  await Blog.deleteOne({ _id: id });
  response.status(204).send();
});

module.exports = blogRouter;
