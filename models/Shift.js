const mongoose = require("mongoose");

const ShiftSchema= new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shopName: { type: String },
  location: { type: String },
  wage: { type: Number },
  date: { type: Number },
  from_time: { type: String },
  end_time: { type: String },
  activeStatus: { type: Boolean, default: true }, 
  more: { type: String },
});

module.exports = mongoose.model("Shift", ShiftSchema);
