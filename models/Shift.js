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

ShiftSchema.virtual('duration').
 get(function() {
  const shiftLength = date.subtract(new Date(this.end_at), new Date(this.start_at)).toHours()
  return Math.round( shiftLength * 100 ) / 100
})

ShiftSchema.virtual('start_time').
 get(function() {
  return date.format(this.start_at, 'hh:mm')
})

ShiftSchema.virtual('end_time').
 get(function() {
  return date.format(this.end_at, 'hh:mm')
})

module.exports = mongoose.model("Shift", ShiftSchema);
