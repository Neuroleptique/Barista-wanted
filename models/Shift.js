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
  start_at: Date,
  end_at: Date,
  duration: Number,
  activeStatus: { type: Boolean, default: true },
  more: String,
  availability: [ { type: String } ]
});

ShiftSchema.pre('save', function save(next) {
  const shift = this
  const oneHour = 1000 * 60 * 60
  this.duration = (new Date(shift.end_at) - new Date(shift.start_at)) / oneHour
  next()
})

module.exports = mongoose.model("Shift", ShiftSchema);
