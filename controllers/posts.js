const cloudinary = require("../middleware/cloudinary");
const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User")

module.exports = {
  getDashboard: async (req, res) => {
    try {
      // const posts = await Post.find({ user: req.user.id });
      if (req.user.userType == 'barista') {
        res.render("dashboard_barista.ejs", { user: req.user });
      } else {
        res.render("dashboard_cafeOwner.ejs", { user: req.user });
      }

    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => {
    // console.log(req.user._id)
    try{
      const userData = await User.findById(req.user._id);
    const baristaData = await Barista.find({ userName: req.user.userName });
      const cafeData = await Cafe.find({ userName: req.user.userName });
      console.log(userData)
      console.log(cafeData)
      if (req.user.userType == 'barista') {
        res.render("profile_barista.ejs", { user: userData, barista: baristaData });
      } else {
        res.render("profile_cafe.ejs", { user: userData, cafe: cafeData });
      }
      // res.render('profile_barista.ejs', { user: userData })
    }catch(err){
      console.log(err)
    }
  },
  updateProfileBarista: async (req, res) => {
    // console.log(req)
    try {
      // const photo = await cloudinary.uploader.upload(req.file.path);
      await User.findOneAndUpdate(
        { _id: req.user._id },{
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          // photo: photo.secure_url,
          // cloudinaryId: photo.public_id,
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
  
};
