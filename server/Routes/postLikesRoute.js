const express = require("express");
const verify = require("../middlewares/verify_token");
const PostlikesController = require("../Controller/postLikesController");
const router = express.Router();

router.get("/getlikes", verify, PostlikesController.getLikes);
router.get("/getlike/:postId", verify, PostlikesController.getLike);
router.post("/addlike/:postId", verify, PostlikesController.addLike);
router.delete("/removelike/:postId", verify, PostlikesController.removeLike);

module.exports = router;
