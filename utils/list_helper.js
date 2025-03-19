const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0);
};

module.exports = {
  totalLikes,
};
