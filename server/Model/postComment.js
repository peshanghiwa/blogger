const mongoose = require("mongoose");

const postsCommentSchema = new mongoose.Schema({
  postSlug: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  dateCommented: {
    type: Date,
  },
});

module.exports = mongoose.model("postsCommentSchema", postsCommentSchema);
