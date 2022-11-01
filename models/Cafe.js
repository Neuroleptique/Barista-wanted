const mongoose = require("mongoose");

const CafeSchema= new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: Number },
  photo: { type: String },
  cloudinaryId: { type: String },
  exp: { type: String },
  ig: { type: String },
  notification: { type: Boolean, default: false },
  more: { type: String},
});

module.exports = mongoose.model("Cafe", CafeSchema);
