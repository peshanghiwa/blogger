const UserModel = require("../Model/User");
const ErrorBuilder = require("../Utils/ErrorBuilder");

exports.getUsers = async (req, res, next) => {
  try {
    let usersPromise = UserModel.find();
    if (req.query.sort) usersPromise.sort(req.query.sort);
    if (req.query.limit) usersPromise.limit(req.query.limit * 1);
    const Users = await usersPromise;
    if (!Users) return next(new ErrorBuilder("No Data Found", 200));
    res.status(200).json({
      status: "success",
      Users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ username: req.params.username });
    if (!user)
      return next(new ErrorBuilder("No Data Found for That username", 404));
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    return next(err);
  }
};
