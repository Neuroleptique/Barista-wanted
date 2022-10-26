const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User");

module.exports = {
  updateProfile: async (req, res) => {
    console.log(req.body)
    console.log('at account controller')
    // try {
    //   const profile = await User.findOneAndUpdate(
    //     { _id: req.user._id },
    //     );
    //   res.render('profile_barista.ejs', { user: req.user })
    // } catch (err) {
    //   console.log(err)
    // }
  }
}