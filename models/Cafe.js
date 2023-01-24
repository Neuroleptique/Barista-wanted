const mongoose = require("mongoose");

const CafeSchema= new mongoose.Schema({
  _userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: String ,
  cafeName: String ,
  place: [{
    geometry: {
      lat: Number,
      lng: Number
    },
    place_id: String,
    formatted_address: String
  }],
  userName: String,
  firstName: String,
  lastName: String,
  phone: Number,
  ig: String,
  more: String,
});

module.exports = mongoose.model("Cafe", CafeSchema);
