const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, lowercase: true },
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 5 },
  content: { type: String, required: true, minLength: 20 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  comments: [commentSchema],
});

const Post = mongoose.model("Post", postSchema);
const Tag = mongoose.model("Tag", tagSchema);

module.exports = { Post, Tag };
