const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift");
const cloudinary = require("../middleware/cloudinary");
const signature = require("../middleware/signuploadform")
const cloudName = cloudinary.config().cloud_name;
const apiKey = cloudinary.config().api_key;

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const today = new Date().toISOString()

      if (req.user.userType == 'barista') {

        // Force user to fill their profile before preceeding to check dashboard
        const baristaData = await Barista.findOne({ userName: req.user.userName });
        if (!baristaData.firstName || !baristaData.lastName) {
          console.log('First or Last Name is empty')
          req.flash("info", {
            msg: "Please update your profile and add your First and Last names",
          });
          return res.redirect('/profile')
        }

        const shiftData = await Shift.find({
          activeStatus: true,
          date: { $gte: today }
        }).sort({ date: 1 });

        const shiftPosters = shiftData.map( s => s.cafeUserName ).flat().filter( (n, idx, arr)=> arr.indexOf(n) == idx )
        const cafeData = await Cafe.find({
          userName: {
            $in: shiftPosters
          }
        })
        res.render("dashboard_barista.ejs", { user: req.user, shifts: shiftData, cafes: cafeData, barista: baristaData });

      } else if (req.user.userType == 'cafe' ) {

        const cafeData = await Cafe.findOne({ userName: req.user.userName });

        // Force cafe user to add their shop location prior posting shift
        if (!cafeData.place.length) {
          console.log('Cafe location is empty')
          req.flash("info", {
            msg: "Please update your cafe's profile and add location",
          });
          return res.redirect('/profile')
        }

        // Active shift = activeStatus == true && date >= today
        const activeShiftData = await Shift.find({
          $and: [
            { _userID: req.user.id },
            { activeStatus: true },
            { date: { $gte: today }}
          ]
        }).sort({ date: 1 });

        // InActive shift = active status == false || date < today
        const inactiveShiftData = await Shift.find({
          $and: [
            { _userID: req.user.id },
            { $or: [
              { activeStatus: false },
              { date: { $lt: today }}
            ]}
          ]
        }).sort({ date: 1 });

        // Determine who are available for shifts posted by individual cafe user and
        // Retrieve available baristas' information for those shifts
        const activeShiftBarista = activeShiftData.map( s => s.availability )
        const inactiveShiftBarista = inactiveShiftData.map( s => s.availability )
        const availableBarista = activeShiftBarista
                                  .concat(inactiveShiftBarista)
                                  .flat()
                                  .filter( (n, idx, arr)=> arr.indexOf(n) == idx )

        const baristaData = await Barista.find({
          userName: {
            $in: availableBarista
          }
        })

        getCloudImgTag(baristaData)
        res.render("dashboard_cafeOwner.ejs", { user: req.user, cafes: cafeData, activeShifts: activeShiftData, inactiveShifts: inactiveShiftData, baristas: baristaData });
      }
    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => {
    try {
      const userData = await User.findById( req.user.id );
      const baristaData = await Barista.findOne({ userName: req.user.userName });
      const cafeData = await Cafe.findOne({ userName: req.user.userName });
      if (req.user.userType == 'barista') {
        getCloudImgTag(new Array(baristaData))

        res.render("profile_barista.ejs", { user: userData, barista: baristaData });
      } else if (req.user.userType == 'cafe') {
        const CONFIG = {
          apiKey: process.env.GOOGLE_MAP_API_KEY
        }
        res.render("profile_cafe.ejs", { user: userData, cafe: cafeData, GOOGLE_MAP_API_KEY: CONFIG.apiKey });
      }
    } catch(err) {
      console.log(err)
    }
  },
  putPhotoInfo: async (req, res) => {
    try{
      const baristaPhotoData = await Barista.findOneAndUpdate({ userName: req.user.userName}, {
        photo: req.body.secure_url,
        cloudinaryId: req.body.public_id
      })
      console.log('Profile photo info updated')
      // Without {new: true} param included, the findOneAndUpdate() will return unupdated document
      if(baristaPhotoData.cloudinaryId){
        await cloudinary.uploader.destroy(baristaPhotoData.cloudinaryId)
        console.log('Previous photo deleted on Cloudinary')
      }
      res.json('Profile photo info updated')
    }catch(err) {
      console.error(err)
    }
  },
  updateProfileBarista: async (req, res) => {
    if(req.body.ig) {
      req.body.ig = req.body.ig.split( 'instagram.com/' ).slice(-1).toString()
    }
    try {
      await Barista.findOneAndUpdate(
        { userName: req.user.userName }, {
          _userID: req.user.id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          ig: req.body.ig,
          exp: req.body.exp,
          more: req.body.more,
          notification: req.body.notification,
        }
      );
      console.log("profile updated!")
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
    }
  },
  updateProfileCafe: async (req, res) => {
    if(req.body.ig) {
      req.body.ig = req.body.ig.split( 'instagram.com/' ).slice(-1).toString()
    }

    try {
      await Cafe.findOneAndUpdate(
        { userName: req.user.userName }, {
          cafeName: req.body.cafeName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          ig: req.body.ig,
          more: req.body.more,
        }
      );
      console.log("profile updated!")
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
    }
  },
  addAddressCafe: async (req, res) => {
    try {
      const cafeData = await Cafe.findOne({ userName: req.user.userName})
      // Check if there is any location info or the address already exists
      if (!cafeData.place.length || cafeData.place.every(p => p.place_id !== req.body.place.place_id) ){
        await Cafe.findOneAndUpdate({userName: req.user.userName},{
              $push: { place: req.body.place }
              })
        console.log('Address added')
        res.json("Address added")
      } else {
        console.log('Address already exists')
        res.json("Address already exists")
      }

      // --> Attempted to minimize db request by utilizing query condition, but it doesn't work :(
      // await Cafe.findOneAndUpdate({
      //   userName: req.user.userName,
      //   place: { $elemMatch: {
      //     place_id: {
      //       $ne: req.body.place.place_id
      //     }
      //   }}}, {
      //     $push: { place: req.body.place }
      //   });

    } catch(err) {
      console.log(err)
    }
  },
  getSignature: (req, res, next) => {
    const sig = signature.signuploadform()
    res.json({
      signature: sig.signature,
      timestamp: sig.timestamp,
      cloudname: cloudName,
      apikey: apiKey
    })
  },
  deleteCloudPhoto: async (req, res, next) => {
    try {
      const baristaData = await Barista.findOne({ userName: req.user.userName })
      await cloudinary.uploader.destroy(baristaData.cloudinaryId)
      console.log('Old photo deleted')
      res.json("Old photo deleted")
    } catch (error) {
      console.error(error)
    }
  }
};

function getCloudImgTag(cloudinaryPhotoData){
  return cloudinaryPhotoData.forEach(baristaInfo => {
    if(baristaInfo.photo){
      return baristaInfo.photo = cloudinary.image(baristaInfo.photo.split('/').slice(-2).join("/"), { transformation: [
      { background: "grey", width: 150, height: 150, crop: "thumb", gravity: "face" }
      ]})
    }
  })
}