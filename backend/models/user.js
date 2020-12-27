// schema for a user
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const saltFactor = 10;

const userSchema = new Schema({
  _id: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  imgs: [{ _id: String, desc: String}],
});

/* https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1 */
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
