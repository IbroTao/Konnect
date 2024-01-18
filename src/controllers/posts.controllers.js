const { Post } = require("../models/posts.models");

const createPost = async (req, res) => {
  try {
    const { file, body } = req;
    const post = await Post.create({
      image: `assets/images/${file.originalname}`,
      name: body.name,
      userid: req.userid,
      category: body.category,
    });
    res.status(200).json({ msg: "Post created" });
  } catch (e) {
    console.log(e);
  }
};

const editPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      category: req.body.category,
    });
    if (!post) return res.status(404).json({ msg: "Post not found!" });
    res.status(200).json({ msg: "Post edited" });
  } catch (e) {
    console.log(e);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found!" });
    res.status(200).json({ msg: "Post deleted" });
  } catch (e) {
    console.log(e);
  }
};

const getByCategory = async (req, res) => {
  try {
    const post = await Post.find({ category: req.params.category }).sort({
      createdAt: "desc",
    });
    if (!post) return res.status(400).json({ msg: "Post not found" });
    return res.status(200).json(post);
  } catch (e) {
    console.log(e);
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.likes = post.likes + 1;
    await post.save();
    res.status(200).json({ msg: "Post liked" });
  } catch (e) {
    console.log(e);
  }
};

const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.likes = post.likes - 1;
    await post.save();
    res.status(200).json({ msg: "Post unliked" });
  } catch (e) {
    console.log(e);
  }
};

const viewPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.views = post.views + 1;
    await post.save();
    res.status(200).json({ msg: "Post viewed" });
  } catch (e) {
    console.log(e);
  }
};

const getMostLikedPost = async (req, res) => {
  try {
    const post = await Post.find({ userid: req.params.id })
      .sort({
        likes: -1,
      })
      .limit(1);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
  }
};

const getMostViewedPost = async (req, res) => {
  try {
    const post = await Post.find({ userid: req.params.id })
      .sort({
        views: -1,
      })
      .limit(1);
    if (!post) return res.status(404).json({ msg: "Post not found!" });
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
  }
};

const totalViews = async (req, res) => {
  try {
    const post = await Post.find({ userid: req.params.id });
    if (!post) return res.status(404).json({ msg: "Post not found" });

    let allViews = 0;
    post.map((item) => {
      allViews = item.views + allViews;
    });
    res.status(200).json({ allViews });
  } catch (e) {
    console.log(e);
  }
};

const totalLikes = async (req, res) => {
  try {
    const post = await Post.find({ userid: req.params.id });
    if (!post) return res.status(404).json({ msg: "Post not found" });

    let allLikes = 0;
    post.map((item) => {
      allLikes = item.likes + allLikes;
    });
    res.status(200).json({ allLikes });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createPost,
  editPost,
  deletePost,
  getByCategory,
  likePost,
  unlikePost,
  viewPost,
  getMostLikedPost,
  getMostViewedPost,
  totalViews,
  totalLikes,
};
