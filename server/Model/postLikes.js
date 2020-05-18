const mongoose = require("mongoose");

const postLikesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likeDate: {
    type: Date,
    default: new Date(Date.now()),
  },
});

module.exports = mongoose.model("postLikesSchema", postLikesSchema);
