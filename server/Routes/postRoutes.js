const express = require("express");
const postController = require("../Controller/postController");
const verify = require("../middlewares/verify_token");
const photo = require("../middlewares/post_photo_upload");
const router = express.Router();

router.post("/addpost", verify, photo.upload, postController.addPost);
router.get("/getposts", postController.getPosts);
router.get("/getpost/:postSlug", postController.getPost);
router.get("/getuserposts/:userId", postController.getPostsForSpecific);
router.patch("/updatepost/:id", verify, postController.updatePost);
router.delete("/deletepost/:id", verify, postController.deletePost);

module.exports = router;
