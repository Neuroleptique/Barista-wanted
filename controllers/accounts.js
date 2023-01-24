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
        console.log(cafeData)
        res.render("profile_cafe.ejs", { user: userData, cafe: new Object(...cafeData) });
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
    if(req.body.mapLink) { 
      req.body.mapLink = req.body.mapLink.split( 'goo.gl/maps/' ).slice(-1).toString()
    }
    try {
      let formatted_address, place_id, geometry
      // Fetch Google find place API to obtain place_id, geometry and formatted_address
      if(req.body.address) {
        req.body.address = req.body.address.replaceAll(',', '').replaceAll(' ', '+')
        const fields = ['formatted_address', 'place_id', 'geometry'].join('%2C')
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${req.body.address}&inputtype=textquery&fields=${fields}&key=${process.env.GOOGLE_MAP_API_KEY}`
        
        const res = await axios.get(url);
        console.log(res.data)
        let result = res.data.candidates[0]
        formatted_address = result.formatted_address
        place_id = result.place_id
        geometry = result.geometry.location
        console.log(geometry)
      }

      await Cafe.findOneAndUpdate(
        { userName: req.user.userName }, {
          _userID: req.user.id,
          cafeName: req.body.cafeName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          place: {
            geometry: geometry,
            place_id: place_id,
            formatted_address: formatted_address
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
  addAddressCafe: async (req, res) => {
    try {
      
      // Fetch Google find place API to obtain place_id, geometry and formatted_address
      // Or use place search api to look for multiple location???
      // but how to add them all in array if length is not set?
      let formatted_address, place_id, geometry
      req.body.address = req.body.address.replaceAll(',', '').replaceAll(' ', '+')
      const fields = ['formatted_address', 'place_id', 'geometry'].join('%2C')
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${req.body.address}&inputtype=textquery&fields=${fields}&key=${process.env.GOOGLE_MAP_API_KEY}`
      
      const res = await axios.get(url);
      console.log(res.data)
      let result = res.data.candidates[0]
      formatted_address = result.formatted_address
      place_id = result.place_id
      geometry = result.geometry.location

      

      await Cafe.findOneAndUpdate({ userName: req.user.userName }, 
        { $push: {
            place: {
              // One or multiple???
            }
          }
        })
    }catch(err) {
      console.log(err)
    }
    

  }
};
