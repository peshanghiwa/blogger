const express = require("express");
const postCommentsController = require("../Controller/postCommentsController");
const verify = require("../middlewares/verify_token");
const router = express.Router();

router.get("/getcomments", verify, postCommentsController.getComments);
router.get("/getcommentsspecific", postCommentsController.getCommentsSpecific);
router.post("/addcomment/:postSlug", verify, postCommentsController.addComment);

module.exports = router;
