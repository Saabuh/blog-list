const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are return as a json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("all blogs have an id named id", async () => {
  const response = await api.get("/api/blogs");

  const results = response.body.filter((blog) => {
    const hasIdKey = "id" in blog;
    const hasUnderscoreIdKey = "_id" in blog; // <-- Negation here

    return !hasIdKey || hasUnderscoreIdKey;
  });

  assert(results.length === 0);
});

test("a valid blog post can be deleted", async () => {
  const contents = await api.get("/api/blogs");
  const blogObject = contents.body[0];

  await api.delete(`/api/blogs/${blogObject.id}`).expect(204);

  const updatedContents = await api.get("/api/blogs");

  assert.strictEqual(
    updatedContents.body.length,
    helper.initialBlogs.length - 1,
  );
});

test("a valid blog post can be added", async () => {
  const newPost = {
    title: "a new blog post",
  };

  await api
    .post("/api/blogs")
    .send(newPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const contents = response.body.map((r) => r.title);

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

  assert(contents.includes("a new blog post"));
});

after(async () => {
  await mongoose.connection.close();
});
