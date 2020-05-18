const jwt = require("jsonwebtoken");
const ErrorBuilder = require("../Utils/ErrorBuilder");

module.exports = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let checkBearer = "Bearer ";
  if (!token) return next(new ErrorBuilder("No Token Provided", 400));
  if (token.startsWith(checkBearer)) {
    token = token.slice(checkBearer.length, token.length);
  }
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return next(new ErrorBuilder("Failed to authenticate", 400));
    }
    req.decoded = decoded;
    next();
  });
};
