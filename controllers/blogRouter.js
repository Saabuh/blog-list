const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  await Blog.deleteOne({ _id: id });
  response.status(204).send();
});

module.exports = blogRouter;
