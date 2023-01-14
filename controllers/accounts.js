const cloudinary = require("../middleware/cloudinary");
const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift")

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const today = new Date().toJSON()
      
      if (req.user.userType == 'barista') {  

        const shiftData = await Shift.find({ 
          activeStatus: true,
          date: { $gte: today }
        }).sort({ date: 1 });
        
        const availableBarista = shiftData.map(s => s.availability).flat().filter((n, idx, arr)=> arr.indexOf(n) == idx )        
        const baristaData = await Barista.find({ 
          userName: {
            $in: availableBarista
          }
        })

        const shiftPoster = shiftData.map(s => s.cafeName)
        const cafeData = await Cafe.find({
          cafeName: {
            $in: shiftPoster
          }
        })
        res.render("dashboard_barista.ejs", { user: req.user, shift: shiftData, cafe: cafeData, barista: baristaData });
        
      } else if (req.user.userType == 'cafe' ) {

        const cafeData = await Cafe.find({ userName: req.user.userName });
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
        const activeShiftDataManipulation = activeShiftData.map(s => {
          // Retrieve and set shift start_time as hh:mm format
          const shiftDateAndTime = new Date(s.date)
          s.start_time = `${shiftDateAndTime.getHours().toString().padStart(2, '0')}:${shiftDateAndTime.getMinutes().toString().padStart(2, '0')}`
          // return an array of all available baristas
          return s.availability
        })

        const inactiveShiftDataManipulation = inactiveShiftData.map(s => {
          // Retrieve and set shift start_time as hh:mm format
          const shiftDateAndTime = new Date(s.date)
          s.start_time = `${shiftDateAndTime.getHours().toString().padStart(2, '0')}:${shiftDateAndTime.getMinutes().toString().padStart(2, '0')}`
          // return an array of all available baristas
          return s.availability
        })

        const availableBarista = activeShiftDataManipulation
                                  .concat(inactiveShiftDataManipulation)
                                  .flat()
                                  .filter((n, idx, arr)=> arr.indexOf(n) == idx )
        
        const baristaData = await Barista.find({ 
          userName: {
            $in: availableBarista
          }
        })

        res.render("dashboard_cafeOwner.ejs", { user: req.user, cafe: new Object(...cafeData), activeShift: activeShiftData, inactiveShift: inactiveShiftData, barista: baristaData});
      }
    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => {
    try{
      const userData = await User.findById( req.user.id );
      const baristaData = await Barista.find({ userName: req.user.userName });
      const cafeData = await Cafe.find({ userName: req.user.userName });
      if (req.user.userType == 'barista') {
        res.render("profile_barista.ejs", { user: userData, barista: new Object(...baristaData) });
      } else if (req.user.userType == 'cafe') {
        console.log(cafeData)
        res.render("profile_cafe.ejs", { user: userData, cafe: new Object(...cafeData) });
      }
    }catch(err){
      console.log(err)
    }
  },
  updateProfileBarista: async (req, res) => {
    req.body.ig = req.body.ig.split('www.instagram.com/').slice(-1)
    try {
      // const photo = await cloudinary.uploader.upload(req.file.path);
      await Barista.findOneAndUpdate(
        { userName: req.user.userName },{
          _userID: req.user.id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          // photo: photo.secure_url,
          // cloudinaryId: photo.public_id,
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
    req.body.ig = req.body.ig.split('instagram.com/').slice(-1)
    req.body.mapLink = req.body.mapLink.split('goo.gl/maps/').slice(-1)
    try {
      await Cafe.findOneAndUpdate(
        { userName: req.user.userName },{
          _userID: req.user.id,
          cafeName: req.body.cafeName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          address: {
            area: req.body.area,
            mapLink: req.body.mapLink
          },
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
};
