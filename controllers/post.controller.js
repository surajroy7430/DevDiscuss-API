const { Post, Tag } = require("../models/post.model");

const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const tagIds = [];
    if (Array.isArray(tags) && tags.length > 0) {
      for (let name of tags) {
        let tag = await Tag.findOne({ name: name.toLowerCase().trim() });

        if (!tag) {
          tag = await Tag.create({ name: name.toLowerCase().trim() });
        }

        tagIds.push(tag._id);
      }
    }

    const post = new Post({
      title,
      content,
      author: req.user.id,
      tags: tagIds,
    });
    await post.save();

    res.status(201).json({ msg: "Post created", post });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ err: "Interval Server Error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const { tag } = req.query;
    let filter = [];

    if (tag) {
      const doc = await Tag.findOne({ name: tag });
      if (doc) {
        filter.tags = doc._id;
      } else {
        return res.json([]);
      }
    }

    const posts = await Post.find(filter)
      .populate("author", "username email role")
      .populate("tags", "name");
    res.json({ total: posts.length, posts });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ err: "Interval Server Error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "username email role")
      .populate("comments");
    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ err: "Interval Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { role, id } = req.user;

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (role === "Moderator") {
      await Post.findByIdAndDelete(req.params.postId);
      res.json({ msg: "post deleted by Moderator" });
    }

    if (post.author.toString() === id.toString()) {
      await Post.findByIdAndDelete(req.params.postId);
      res.json({ msg: "Your post has been deleted" });
    }

    return res
      .status(403)
      .json({ msg: "You are not allowed to delete a post" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ err: "Interval Server Error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.staus(400).json({ msg: "Comment text is required" });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.staus(404).json({ msg: "Post not found" });

    post.comments.push({
      user: req.user.id,
      text,
    });
    await post.save();

    res
      .status(201)
      .json({ msg: "Comment added in post", comments: post.comments });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ err: "Interval Server Error" });
  }
};

const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.staus(404).json({ msg: "Post not found" });

    const upvoted = post.upvotes.includes(req.user.id);
    if (upvoted)
      return res
        .status(400)
        .json({ msg: "You have already upvotes this post" });

    post.upvotes.push(req.user.id);
    await post.save();

    res.json({ msg: "Post upvoted", upvoteCount: post.upvotes.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ err: "Interval Server Error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  upvotePost,
  addComment,
};
