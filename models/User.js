const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const BaristaSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: Number, unique: true },
  photo: { type: String },
  cloudinaryId: { type: String },
  exp: { type: String },
  ig: { type: String },
  notification: { type: Boolean, default: false },
});

// Password hash middleware.

BaristaSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

BaristaSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", BaristaSchema);
