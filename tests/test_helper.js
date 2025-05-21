const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "test",
    author: "yeppers",
    url: "www.yep.com",
    likes: 5,
  },
  {
    title: "test2",
    author: "yeppers2",
    url: "www.yep2.com",
    likes: 9,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDB,
};
