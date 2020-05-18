const UserModel = require("../Model/User");
const ErrorBuilder = require("../Utils/ErrorBuilder");
const bcrypt = require("bcrypt");
const sendEmail = require("../Utils/email");

exports.sendEmail = async (req, res, next) => {
  try {
    if (!req.body.email)
      return next(
        new ErrorBuilder("Please provide your current email address!", 400)
      );

    const email = await UserModel.findOne({ email: req.body.email }).select(
      "+passwordRecovery"
    );
    if (!email)
      return next(
        new ErrorBuilder("No user found for the entered email address!", 400)
      );

    if (
      email.passwordRecovery.sent &&
      email.passwordRecovery.timeout > new Date(Date.now())
    ) {
      return next(
        new ErrorBuilder(
          "a valid password recovery digit has already been sent to your email address check it out!",
          400
        )
      );
    }

    const generatedDigit = Math.floor(Math.random() * 99999 + 10000) + "";
    const hashedDigit = await bcrypt.hash(generatedDigit, 12);

    await sendEmail({
      email: req.body.email,
      subject: "Resset Your Forgotten Password",
      message: `Your Password Reset Digit Code is: ${generatedDigit} available for only 30 minutes, later on it expires...`,
      html: `<h3>Your Password Reset Digit Code is:<b style="color:red;"> ${generatedDigit}</b> available for only 30 minutes, later on it expires...</h3>`,
    });

    const updatedRecoverySettings = await UserModel.findByIdAndUpdate(
      email._id,
      {
        passwordRecovery: {
          changedAt: email.passwordRecovery.changedAt,
          sent: true,
          timeout: Date.now() + 180000,
          digit: hashedDigit,
        },
      },
      { new: true }
    ).select("+passwordRecovery");

    res.status(200).json({
      status: "success",
      message: "a 5 digit code has been sent to your email successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.checkDigit = async (req, res, next) => {
  try {
    if (!req.params.email)
      return next(
        new ErrorBuilder(
          "Please provide your current email address in the url!",
          400
        )
      );

    const email = await UserModel.findOne({ email: req.params.email }).select(
      "+passwordRecovery"
    );
    if (!email)
      return next(
        new ErrorBuilder("No user found for the entered email address!", 400)
      );

    if (!email.passwordRecovery.sent) {
      return next(
        new ErrorBuilder(
          "No password resseting code has been sent to your email!",
          400
        )
      );
    }

    if (email.passwordRecovery.timeout < new Date(Date.now())) {
      await UserModel.findByIdAndUpdate(
        email._id,
        {
          passwordRecovery: {
            changedAt: email.passwordRecovery.changedAt,
            sent: false,
            timeout: 0,
            digit: 0,
            readyToChange: false,
          },
        },
        { new: true }
      );
      return next(
        new ErrorBuilder(
          "Your password reset digit is expired, please send another one!",
          400
        )
      );
    }

    if (!(await bcrypt.compare(req.body.digit, email.passwordRecovery.digit)))
      return next(new ErrorBuilder("Entered Digit is wrong!", 400));

    const PasswordRecoverySetting = await UserModel.findByIdAndUpdate(
      email._id,
      {
        passwordRecovery: {
          changedAt: email.passwordRecovery.changedAt,
          sent: false,
          timeout: Date.now() + 180000,
          digit: 0,
          readyToChange: true,
        },
      },
      { new: true }
    ).select("+passwordRecovery");

    res.status(200).json({
      status: "success",
      data: email,
      newData: PasswordRecoverySetting,
    });
  } catch (err) {
    next(err);
  }
};

exports.recoverPassword = async (req, res, next) => {
  try {
    if (!req.params.email)
      return next(
        new ErrorBuilder(
          "Please provide your current email address in the url!",
          400
        )
      );

    const email = await UserModel.findOne({ email: req.params.email }).select(
      "+passwordRecovery"
    );
    if (!email)
      return next(
        new ErrorBuilder("No user found for the entered email address!", 400)
      );

    if (!email.passwordRecovery.readyToChange) {
      return next(
        new ErrorBuilder(
          "No ready state detected for changing password, please try password reset request before accessing here!",
          400
        )
      );
    }

    if (email.passwordRecovery.timeout < new Date(Date.now())) {
      await UserModel.findByIdAndUpdate(
        email._id,
        {
          passwordRecovery: {
            changedAt: email.passwordRecovery.changedAt,
            sent: false,
            timeout: 0,
            digit: 0,
            readyToChange: false,
          },
        },
        { new: true }
      );
      return next(
        new ErrorBuilder(
          "Your password reset ready state is expired, please send another one!",
          400
        )
      );
    }

    const newPassword = await bcrypt.hash(req.body.password, 12);

    await UserModel.findByIdAndUpdate(
      email._id,
      {
        password: newPassword,
        passwordRecovery: {
          changedAt: Date.now(),
          sent: false,
          timeout: 0,
          digit: 0,
          readyToChange: false,
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err) {
    next(err);
  }
};
