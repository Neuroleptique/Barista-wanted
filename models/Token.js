const mongoose = require('mongoose')


const TokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  // Set token expiration time to 86400000ms == 24hours
  expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
});

module.exports = mongoose.model("Token", TokenSchema);