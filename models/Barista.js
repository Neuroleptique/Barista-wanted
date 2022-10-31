const mongoose = require("mongoose");

const BaristaSchema= new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: { type: String },
  lastName: { type: String },
  // email: { type: String, unique: true },
  phone: { type: Number, unique: true },
  photo: { type: String },
  cloudinaryId: { type: String },
  exp: { type: String },
  ig: { type: String },
  notification: { type: Boolean, default: false },
  more: { type: String},
});

module.exports = mongoose.model("Barista", BaristaSchema);
