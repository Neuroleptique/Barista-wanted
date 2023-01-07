const mongoose = require('mongoose')


const TokenSchema = new mongoose.Schema({
  _userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  token: { 
    type: String, 
    required: true 
  },
  expireAt: { 
    type: Date, 
    default: Date.now, 
    index: { 
      expires: 3600000
    } 
  }
});

module.exports = mongoose.model("Token", TokenSchema);