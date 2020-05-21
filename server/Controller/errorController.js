const errorResponse = (err, res) => {
  if (process.env.mode === "production") {
    res.status(err.statusCode).json({
      error: err,
      message: err.message
    });
  } else if (process.env.mode === "development") {
    res.status(err.statusCode).json({
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || "Error";
  err.statusCode = err.statusCode || 500;

  //-> Cloning the err Object in order not to alter the original Error variable
  let error = { ...err };
  error.message = err.message;

  /* --- Checking for Error Types to handle ---- */
  //-> Checking Cast Errors Coming From Mongoose
  if (err.name == "CastError") {
    error.message = `Request Failed, No Data found for: ${err.value}`;
    error.statusCode = 400;
  }

  //-> Checking Validation Errors Coming from mongoose
  if (err.name == "ValidationError") {
    let message = [];
    Object.entries(err.errors).forEach(element => {
      message.push(element[1].message);
    });
    error.message = message;
  }

  //-> checking token Errors coming from the Json Web Token Library
  if (err.name == "JsonWebTokenError") {
    if (err.message == "Invalid Signture")
      error.message =
        "The Currently used Token is Invalid, Please login again!";
    if (err.message == "jwt malformed")
      error.message = "You aren't Logged in, please log in to get access.";
  }

  //->Preventing duplicate emails while creating accounts
  if (err.code === 11000) {
    // error.message = `There is already an existing account with this email address: ${err.keyValue.email}`;

    console.log(err);
  }

  errorResponse(error, res);
};

// E11000 duplicate key error collection: Blogger.postsmodels index: likes_1 dup key: { likes: ObjectId('5ec1aa0c83ad562f14b72c17') }
