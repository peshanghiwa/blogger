const express = require("express");
const userController = require("../Controller/userController");
const authController = require("../Controller/authController");
const emailController = require("../Controller/emailController");
const verify = require("../middlewares/verify_token");
const rateLimit = require("express-rate-limit");

const emailLimit = rateLimit({
  max: 5,
  windowMs: 24 * 60 * 60 * 1000,
  message: "You have reached request limits please try again later",
});

const router = express.Router();

router.get("/getusers", userController.getUsers);
router.get("/getusers/:username", userController.getUser);

//-> Password Recovery Routes
router.post("/recovery/sendemail", emailLimit, emailController.sendEmail);
router.post("/recovery/checkdigit/:email", emailController.checkDigit);
router.post(
  "/recovery/recoverpassword/:email",
  emailController.recoverPassword
);

module.exports = router;
