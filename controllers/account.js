const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User");

module.exports = {
  updateProfile: async (req, res) => {

    try {
      const photo = await cloudinary.uploader.upload(req.file.path);
      const profile = await User.findOneAndUpdate(
        { _id: req.user._id },{
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          photo: photo.secure_url,
          cloudinaryId: photo.public_id,
          ig: req.body.ig,
          exp: req.body.exp,
          more: req.body.more,
          notification: req.body.notification
        }
      );
      console.log("profile updated!")
      res.redirect('profile_barista.ejs', { user: req.user })
    } catch (err) {
      console.log(err)
    }
  },
}