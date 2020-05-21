const express = require("express");
const authController = require("../Controller/authController");
const verifyToken = require("../middlewares/verify_token");
const photo = require("../middlewares/user_photo_upload");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limitSignup = rateLimit({
  max: 10,
  windowMs: 24 * 60 * 60 * 1000,
  message: "You have reached request limits please try again later"
});
const limitlogin = rateLimit({
  max: 100,
  windowMs: 24 * 60 * 60 * 1000,
  message: "You have reached request limits please try again later"
});

router.post("/signup", photo.upload, authController.signUp);
router.post("/login", limitlogin, authController.login);
router.get("/user", verifyToken, authController.user);

module.exports = router;
