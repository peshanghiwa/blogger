const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name is Required!"]
  },
  username: {
    type: String,
    required: [true, "Username is Required!"],
    unique: [true, "This username already exists in the database!"]
  },
  email: {
    type: String,
    required: [true, "Email is Required!"],
    unique: [true, "This Email already exists in the database!"]
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: [true, "Password is Required!"],
    minlength: [6, "Password length should at least be 6 characters!"],
    select: false
  },
  createdAt: {
    type: Date
  },
  photo: {
    type: Object
  },
  passwordRecovery: {
    type: Object,
    select: false
  }
});

userSchema.methods.comparePasswords = async function(password, next) {
  let user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function(next) {
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.createdAt = Date.now();
    this.passwordRecovery = {
      changedAt: 0,
      timeout: 0,
      sent: false,
      readyToChange: false,
      digit: String
    };
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("UserModel", userSchema);
