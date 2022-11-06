const cloudinary = require("../middleware/cloudinary");
const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift")

module.exports = {
  getDashboard: async (req, res) => {
    try {
      // const posts = await Post.find({ user: req.user.id });
      if (req.user.userType == 'barista') {
        res.render("dashboard_barista.ejs", { user: req.user });
      } else if (req.user.userType == 'cafe' ) {
        const cafeData = await Cafe.find({ userName: req.user.userName });
        const shiftData = await Shift.find({ userID: req.user.id }).sort({ date: 1 });
        res.render("dashboard_cafeOwner.ejs", { user: req.user, cafe: new Object(...cafeData), shift: shiftData });
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
      if (req.user.userType == 'barista') {
        res.render("profile_barista.ejs", { user: userData, barista: new Object(...baristaData) });
      } else {
        res.render("profile_cafe.ejs", { user: userData, cafe: new Object(...cafeData) });
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
      await Barista.findOneAndUpdate(
        { userName: req.user.userName },{
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          // photo: photo.secure_url,
          // cloudinaryId: photo.public_id,
          ig: req.body.ig,
          exp: req.body.exp,
          more: req.body.more,
          notification: req.body.notification,
          userID: req.body.userID,
        }
      );
      console.log("profile updated!")
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
    }
  },
  updateProfileCafe: async (req, res) => {
    console.log(req)
    try {
      await Cafe.findOneAndUpdate(
        { userName: req.user.userName },{
          shopName: req.body.shopName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          address: req.body.address,
          ig: req.body.ig,
          more: req.body.more,
          userID: req.body.userID,
        }
      );
      console.log("profile updated!")
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
    }
  },
};
