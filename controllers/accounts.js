const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift");
const cloudinary = require("../middleware/cloudinary");
const signature = require("../middleware/signuploadform")
const cloudName = cloudinary.config().cloud_name;
const apiKey = cloudinary.config().api_key;
const date = require("date-and-time")

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const today = new Date().toISOString()

      if (req.user.userType == 'barista' && !req.user.isTesting) {

        const baristaData = await Barista.findOne({ userName: req.user.userName });
        if (!baristaData.firstName || !baristaData.lastName) {
          console.log('First or Last Name is empty')
          req.flash("info", {
            msg: "Please update your profile and add your First and Last names",
          });
          return res.redirect('/profile')
        }

        const activeShiftData = await Shift.find({
          $and: [
            { activeStatus: true },
            { start_at: { $gte: today } },
            // testing user's userName is hardcoded as 'cafe'
            { cafeUserName: { $ne: 'cafe' } }
          ]

        }).sort({ start_at: 1 });



        const pastShiftData = await Shift.find({
          $and: [
            { availability: { $in: [ req.user.userName ]}},
            { $or: [
              { start_at: { $lt: today }},
              { activeStatus: false }
            ]}
          ]
        })

        const activeShiftPoster = activeShiftData.map( s => s.cafeUserName )
        const pastShiftPoster = pastShiftData.map( s => s.cafeUserName)
        const allShiftPosters = activeShiftPoster.concat(pastShiftPoster)
                                .flat()
                                .filter( (n, idx, arr) => arr.indexOf(n) == idx )

        const cafeData = await Cafe.find({
          userName: {
            $in: allShiftPosters
          }
        })
        res.render("dashboard_barista.ejs", { user: req.user, activeShifts: activeShiftData, pastShifts: pastShiftData, cafes: cafeData, barista: baristaData, date: date });

      } else if (req.user.userType == 'cafe' ) {

        const cafeData = await Cafe.findOne({ userName: req.user.userName });

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
            { start_at: { $gte: today }}
          ]
        }).sort({ start_at: 1 });

        // InActive shift = active status == false || date < today
        const inactiveShiftData = await Shift.find({
          $and: [
            { _userID: req.user.id },
            { ownerDisplay: true },
            { $or: [
              { activeStatus: false },
              { start_at: { $lt: today }}
            ]}
          ]
        }).sort({ start_at: 1 });

        const activeShiftBarista = activeShiftData.map( s => s.availability )
        const inactiveShiftBarista = inactiveShiftData.map( s => s.availability )
        const allAvailableBaristas = activeShiftBarista
                                  .concat(inactiveShiftBarista)
                                  .flat()
                                  .filter( (n, idx, arr)=> arr.indexOf(n) == idx )

        const baristaData = await Barista.find({
          userName: {
            $in: allAvailableBaristas
          }
        })

        getCloudImgTag(baristaData)
        res.render("dashboard_cafeOwner.ejs", { user: req.user, cafe: cafeData, activeShifts: activeShiftData, inactiveShifts: inactiveShiftData, baristas: baristaData, date: date });


      } else if (req.user.userType == 'barista' && req.user.isTesting ) {
        console.log('barista testing')

        const activeShiftData = await Shift.find({
          $and: [
            { cafeUserName: 'cafe' },
            { activeStatus: true },
            { start_at: { $gte: today }}
          ]

        }).sort({ start_at: 1 });



        const pastShiftData = await Shift.find({
          $and: [
            { cafeUserName: 'cafe' },
            { availability: { $in: [ req.user.userName ]}},
            { $or: [
              { start_at: { $lt: today }},
              { activeStatus: false }
            ]}
          ]
        })
        // testing user's userName is hardcoded as 'cafe'
        const cafeData = await Cafe.findOne({ userName: 'cafe' })
        res.render("dashboard_barista.ejs", { user: req.user, activeShifts: activeShiftData, pastShifts: pastShiftData, cafes: new Array(cafeData), date: date });

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