const mongoose = require("mongoose");
const date = require('date-and-time')

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
  start_at: Date,
  end_at: Date,
  activeStatus: { type: Boolean, default: true },
  more: String,
  availability: [ { type: String } ]
});

module.exports = mongoose.model("Shift", ShiftSchema);
