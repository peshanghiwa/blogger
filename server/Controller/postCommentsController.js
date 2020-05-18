const CommentsModel = require("../Model/postComment");
const ErrorBuilder = require("../Utils/ErrorBuilder");

exports.addComment = async (req, res, next) => {
  try {
    const newCommentPromise = new CommentsModel();
    newCommentPromise.userId = req.decoded.id;
    newCommentPromise.postSlug = req.params.postSlug;
    newCommentPromise.comment = req.body.comment;
    newCommentPromise.dateCommented = new Date(Date.now());
    const newComment = await newCommentPromise.save();

    res.status(200).json({
      newComment,
      status: "success",
      message: "New Comment Added Successfully!",
    });
  } catch (err) {
    return next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await CommentsModel.find().populate(
      "userId",
      "-_id -email -birthdate -gender -createdAt"
    );

    if (!comments) {
      return next(new ErrorBuilder("No commetns found", 400));
    }

    res.status(200).json({
      status: "success",
      comments,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getCommentsSpecific = async (req, res, next) => {
  let requestLimit;
  try {
    const commentsPromise = CommentsModel.find({})
      .populate("userId", "-_id -email -birthdate -gender -createdAt")
      .where("postSlug")
      .equals(req.query.post);

    if (req.query.limit) commentsPromise.limit(req.query.limit * 1 + 1);
    if (req.query.skip) commentsPromise.skip(req.query.skip * 1);
    if (req.query.sort) commentsPromise.sort(req.query.sort);
    else commentsPromise.sort("-dateCommented");
    const comments = await commentsPromise;

    if (!comments) {
      return next(new ErrorBuilder("No commetns found", 400));
    }

    if (comments.length <= 3) requestLimit = false;
    else {
      requestLimit = true;
      comments.pop();
    }

    res.status(200).json({
      requestLimit,
      status: "success",
      comments,
    });
  } catch (err) {
    return next(err);
  }
};
