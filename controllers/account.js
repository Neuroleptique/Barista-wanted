const cloudinary = require("../middleware/cloudinary");
const Profile = require("../models/Profile");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const prof = await Profile.find({ user: req.user.id });
      res.render('profile_barista.ejs', { user: req.user })
    } catch (err) {
      console.log(err)
    }
  }
}