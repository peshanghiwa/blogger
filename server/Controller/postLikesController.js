const PostLikesModel = require("../Model/postLikes");
const postsModel = require("../Model/Post");
const ErrorBuilder = require("../Utils/ErrorBuilder");
exports.addLike = async (req, res, next) => {
  try {
    const newLikePromise = new PostLikesModel();
    newLikePromise.userId = req.decoded.id;
    newLikePromise.postId = req.params.postId;
    const newLike = await newLikePromise.save();
    await postsModel.findByIdAndUpdate(newLike.postId, {
      $push: { likes: newLike.userId },
    });
    res.status(200).json({
      status: "success",
      message: "Post Liked Successfully!",
    });
  } catch (err) {
    return next(err);
  }
};

exports.getLikes = async (req, res, next) => {
  try {
    const likes = await PostLikesModel.find();
    res.status(200).json({
      status: "success",
      likes,
    });
  } catch (err) {
    return next(err);
  }
};

exports.removeLike = async (req, res, next) => {
  try {
    const liked = await PostLikesModel.findOne({
      userId: req.decoded.id,
      postId: req.params.postId,
    });
    if (liked) {
      await PostLikesModel.findOneAndDelete({
        userId: liked.userId,
        postId: liked.postId,
      });
      await postsModel.findByIdAndUpdate(liked.postId, {
        $pullAll: { likes: [liked.userId] },
      });
    }
    res.status(200).json({
      status: "success",
      message: "Like Removed Successfully!",
    });
  } catch (err) {
    return next(err);
  }
};

exports.getLike = async (req, res, next) => {
  try {
    let found = false;
    const like = await PostLikesModel.findOne({
      postId: req.params.postId,
      userId: req.decoded.id,
    });
    if (like) found = true;
    res.status(200).json({
      found,
      status: "success",
      like,
    });
  } catch (err) {
    return next(err);
  }
};
