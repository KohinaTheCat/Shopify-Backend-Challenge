const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// to ensure the password is not stored in the DB in plain text
const bcrypt = require("bcrypt");
const saltFactor = 10;

/**
 * Schema for user
 * @property {String}     _id               username of user
 * @property {String}     password          password of user
 * @property {[Object]}   images            array to store user images 
 */
const userSchema = new Schema({
  _id: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: "password is required",
  },
  imgs: [{ _id: String, desc: String}],
});

//comparing password entered
userSchema.methods.comparePassword = function (newPass, callBack) {
  bcrypt.compare(newPass, this.password, function (err, isMatch) {
    if (err) return callBack(err);

    // err is null here since compare didn't throw an err
    callBack(null, isMatch);
  });
};

// hashing middleware
userSchema.pre("save", function (next) {
  let user = this;

  // check if password was modified or not
  if (!user.isModified("password")) return next();

  // generate the hash and store password
  bcrypt.hash(user.password, saltFactor, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
