const mongoose = require("mongoose");

const ShiftSchema= new mongoose.Schema({
  _userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cafeUserName: String,
  cafeName: String,
  location: {
    geometry: {
      lat: Number,
      lng: Number
    },
    place_id: String,
    formatted_address: String
  },
  wage: Number,
  tips: Boolean,
  date: Date,
  start_time: String,
  end_time: String,
  activeStatus: { type: Boolean, default: true }, 
  more: String,
  availability: [ { type: String } ],
  ownerDisplay: { type: Boolean, default: true }
});

module.exports = mongoose.model("Shift", ShiftSchema);
