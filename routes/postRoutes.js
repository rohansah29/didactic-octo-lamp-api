const express = require("express");
const PostModel = require("../models/postModel");
const auth = require("../middleware/auth.middleware");

const postRouter = express.Router();

// Retrieve all posts
postRouter.get("/posts", async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

postRouter.get("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve posts with pagination
postRouter.get("/posts", async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const posts = await PostModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve posts by category
postRouter.get("/posts/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await PostModel.find({ category });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search posts by title
postRouter.get("/posts", async (req, res) => {
    try {
      const { title } = req.query;
      let posts;
      console.log("yes",title,req.query)
      if (title) {
        posts = await PostModel.find({ title: { $regex: title, $options: "i" } });
      } else {
        posts = await PostModel.find();
      }
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });  

// Create a new post
postRouter.post("/posts", auth, async (req, res) => {
    const user_id = req.user_id;
  const { title, category, content, media } = req.body;

  try {
    const newPost = new PostModel({user_id, title, category, content, media });
    await newPost.save();
    res.status(201).json({ msg: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit a post
postRouter.put("/posts/:post_id", auth, async (req, res) => {
  const { post_id } = req.params;
  const { title, category, content, media } = req.body;
  try {
    const post = await PostModel.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (req.user_id !== post.user_id.toString()) {
      return res.status(401).json({ error: "You are not authorized to edit this post" });
    }
    const updatedPost = await PostModel.findByIdAndUpdate(post_id, { title, category, content, media }, { new: true });
    res.status(200).json({ msg: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a post
postRouter.delete("/posts/:post_id", auth, async (req, res) => {
  const { post_id } = req.params;
  try {
    const post = await PostModel.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (req.user_id !== post.user_id.toString()) {
      return res.status(401).json({ error: "You are not authorized to delete this post" });
    }
    await PostModel.findByIdAndDelete(post_id);
    res.status(202).json({ msg: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Like a post
postRouter.post("/posts/:post_id/like", auth, async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.body;

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(post_id, { $addToSet: { likes: user_id } }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ msg: "Post liked successfully", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Comment on a post
postRouter.post("/posts/:post_id/comment", auth, async (req, res) => {
  const { post_id } = req.params;
  const { user_id, comment,username } = req.body;

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(post_id, { $push: { comments: { user_id, comment,username } } }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ msg: "Comment added successfully", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = postRouter;
