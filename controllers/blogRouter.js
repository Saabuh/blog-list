const blogRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;

  //find first user and make them the creator of blog
  const foundUser = await User.findOne({});

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
