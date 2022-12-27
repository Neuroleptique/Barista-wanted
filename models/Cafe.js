const mongoose = require("mongoose");

const CafeSchema= new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: String ,
  cafeName: String ,
  address: [{
    area: String,
    mapLink: String
  }],
  userName: String,
  firstName: String,
  lastName: String,
  phone: Number,
  ig: String,
  more: String,
});

module.exports = mongoose.model("Cafe", CafeSchema);
