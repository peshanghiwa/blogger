const PostModel = require("../Model/Post");
const fs = require("fs");
const ErrorBuilder = require("../Utils/ErrorBuilder");

exports.addPost = async (req, res, next) => {
  try {
    const Post = new PostModel();
    Post.title = req.body.title;
    Post.content = req.body.content;
    Post.author = req.decoded.id;
    Post.createdAt = new Date(Date.now());

    if (req.file) {
      Post.photo = req.file.filename;
    } else {
      Post.photo = "default.jpeg";
    }

    const newPost = await Post.save();
    res.status(200).json({
      status: "success",
      message: "New post has been added succefully",
      post: newPost
    });
  } catch (err) {
    return next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  let requestLimit;
  try {
    const postsPromise = PostModel.find().populate("author");

    if (req.query.sort) postsPromise.sort(req.query.sort);
    if (req.query.skip) postsPromise.skip(req.query.skip * 1);
    if (req.query.limit) postsPromise.limit(req.query.limit * 1);

    const posts = await postsPromise;
    if (!posts) return next(new ErrorBuilder("No data found!", 204));
    if (posts.length <= 10) requestLimit = false;
    else {
      requestLimit = true;
      posts.pop();
    }
    res.status(200).json({
      status: "success",
      posts,
      requestLimit
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getPostsForSpecific = async (req, res, next) => {
  try {
    const postsPromise = PostModel.find()
      .where("author")
      .equals(req.params.userId);

    if (req.query.sort) postsPromise.sort(req.query.sort);
    else postsPromise.sort("-createdAt");
    if (req.query.limit) postsPromise.limit(req.query.limit * 1);

    const posts = await postsPromise;
    if (!posts)
      return next(new ErrorBuilder("No posts found for this user!", 404));
    res.status(200).json({
      status: "success",
      posts
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    console.log("here1");
    const post = await PostModel.findOne({ postSlug: req.params.postSlug })
      .populate("author")
      .exec();
    console.log("here2");
    if (!post) {
      return next(
        new ErrorBuilder(
          "No post is found for the requested url informations",
          404
        )
      );
    }
    res.status(200).json({
      status: "success",
      post
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const data = { ...req.body };
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return next(
        new ErrorBuilder("Can't update information, no post is found!", 400)
      );
    }
    if (post.author != req.decoded.id)
      return next(
        new ErrorBuilder("Sorry You can't modify unauthorized posts", 400)
      );

    //in order to update only the modified field and not all of them at once
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    }
    await PostModel.findByIdAndUpdate(req.params.id, data);

    res.status(200).json({
      status: "success",
      message: "Post Updated Successfully"
    });
  } catch (err) {
    return next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return next(
        new ErrorBuilder("Can't update information, no post is found!", 400)
      );
    }
    if (post.author != req.decoded.id)
      return next(
        new ErrorBuilder("Sorry You can't Delete unauthorized posts", 400)
      );

    if (post.photo != "default.jpeg") {
      fs.unlink(`../client/assets/images/posts/${post.photo}`, () => {});
    }

    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Post Deleted Successfully!"
    });
  } catch (err) {
    next(err);
  }
};
