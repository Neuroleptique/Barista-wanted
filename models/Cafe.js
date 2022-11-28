const mongoose = require("mongoose");

const CafeSchema= new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cafeName: { type: String },
  userName: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: Number },
  address: { type: String }, 
  ig: { type: String },
  more: { type: String},
});

module.exports = mongoose.model("Cafe", CafeSchema);
