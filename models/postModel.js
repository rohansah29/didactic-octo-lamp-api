const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, maxlength: 100 },
  category: { type: String, enum: ['Development', 'Design', 'Innovation', 'Tutorial', 'Business'] },
  content: { type: String },
  media: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    username: String,
    created_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now },
});

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
