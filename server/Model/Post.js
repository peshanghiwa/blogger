const mongoose = require("mongoose");
const User = require("./User");
const Likes = require("./postLikes");

const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Posts Require a Title!"],
  },
  postSlug: {
    type: Number,
    // unique: true,
  },
  content: {
    type: String,
    required: [true, "Posts Require a Content!"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: [true, "Posts Require an Author!"],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "postLikesSchema",
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "postsCommentSchema",
  },
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

postsSchema.pre("save", async function (next) {
  //-> fetch the user data to the author document
  const result = await User.findById(this.author);
  this.author = result;

  this.postSlug = Math.floor(Math.random() * 100000000000 + 100000);
  next();
});

module.exports = mongoose.model("PostsModel", postsSchema);
