const UserModel = require("../Model/User");
const jwt = require("jsonwebtoken");
const ErrorBuilder = require("../Utils/ErrorBuilder");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dqxq27c81",
  api_key: "851162165596877",
  api_secret: "Q10qxubSOPLk4Ikqnh7F44oMnEU"
});

exports.signUp = async (req, res, next) => {
  try {
    const User = new UserModel({
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      birthdate: req.body.birthdate
    });

    cloudinary.uploader.upload(
      __dirname + `/../../assets/images/users/${req.file.filename}`,
      { format: "png", transformation: [{ width: 500, height: 500 }] },
      (err, result) => {
        if (err)
          return next(
            new ErrorBuilder(
              "There was a problem uploading photo, please try again!",
              400
            )
          );
        User.photo = { url: result.url, id: result.public_id };
        fs.unlink(
          __dirname + `/../../assets/images/users/${req.file.filename}`,
          async () => {
            const newUser = await User.save();
            const token = await jwt.sign(
              newUser.toJSON(),
              process.env.JWT_KEY,
              { expiresIn: 604800 }
            );
            res.status(200).json({
              user: newUser,
              status: "success",
              token
            });
          }
        );
      }
    );
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return next(
        new ErrorBuilder(
          "Please fill all the login Informations before submitting",
          400
        )
      );
    }

    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return next(
        new ErrorBuilder("No user found with the Entered Email Address!", 400)
      );
    }

    if (!(await user.comparePasswords(req.body.password))) {
      return next(new ErrorBuilder("Password is incorrect!", 400));
    }

    const token = await jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username
      },
      process.env.JWT_KEY,
      { expiresIn: 604800 }
    );

    res.status(200).json({
      status: "success",
      token,
      message: "Login succefull!"
    });
  } catch (err) {
    return next(err);
  }
};

exports.user = async (req, res, next) => {
  try {
    const foundUser = await UserModel.findById(req.decoded.id);

    // if (!foundUser) {
    //   return next(new ErrorBuilder("No User Found", 404));
    // }
    res.status(200).json({
      status: "success",
      user: foundUser
    });
  } catch (err) {
    return next(err);
  }
};
