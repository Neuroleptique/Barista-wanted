const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift");
const axios = require("axios");

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const today = new Date().toJSON()
      
      if (req.user.userType == 'barista') {  

        const shiftData = await Shift.find({ 
          activeStatus: true,
          date: { $gte: today }
        }).sort({ date: 1 });
        
        const availableBarista = shiftData.map( s => s.availability ).flat().filter( (n, idx, arr)=> arr.indexOf(n) == idx )        
        const baristaData = await Barista.find({ 
          userName: {
            $in: availableBarista
          }
        })

        const shiftPoster = shiftData.map( s => s.cafeUserName ).flat().filter( (n, idx, arr)=> arr.indexOf(n) == idx )
        const cafeData = await Cafe.find({
          userName: {
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

        res.render("dashboard_cafeOwner.ejs", { user: req.user, cafe: cafeData, activeShift: activeShiftData, inactiveShift: inactiveShiftData, barista: baristaData });
      }
    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => {
    try {
      const userData = await User.findById( req.user.id );
      const baristaData = await Barista.find({ userName: req.user.userName });
      const cafeData = await Cafe.find({ userName: req.user.userName });
      if (req.user.userType == 'barista') {
        res.render("profile_barista.ejs", { user: userData, barista: new Object(...baristaData) });
      } else if (req.user.userType == 'cafe') {
        const CONFIG = {
          apiKey: process.env.GOOGLE_MAP_API_KEY
        }
        res.render("profile_cafe.ejs", { user: userData, cafe: new Object(...cafeData), GOOGLE_MAP_API_KEY: CONFIG.apiKey });
      }
    } catch(err) {
      console.log(err)
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
      const cafeData = await Cafe.findOne({ _userID: req.user.id})
      const existingAddress = cafeData.place.every(p => p.place_id !== req.body.place.place_id)
      
      if(existingAddress) {
        await Cafe.findOneAndUpdate({userName: req.user.userName},{
         $push: { place: req.body.place }
        })
        console.log('Address added')    
        res.json("Address added")
      } else {
        console.log('Address already exists')    
        res.json("Address already exists")
      }
      
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
  }
};
