const cloudinary = require("../middleware/cloudinary");
const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift")

module.exports = {
  postShift: async (req, res) => {
    try {
      const cafeData = await Cafe.findOne({ userID: req.user._id })
      await Shift.create({
        userID: req.body.userID,
        shopName: cafeData.shopName,
        location: req.body.location,
        wage: req.body.wage,
        // Parse to ms and store as number
        date: Date.parse(req.body.date),
        from_time: req.body.from_time,
        end_time: req.body.end_time,
        activeStatus: req.body.activeStatus,
        more: req.body.more,
      })
      console.log('Shift created!')
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
    }
  },
  inactiveShift: async (req, res) => {
    try {
      await Shift.findOneAndUpdate({ _id: req.body.shiftID },{
        activeStatus: false
      });
      console.log('Shift is inactive')
      res.json('Shift fulfilled')
    } catch(err) {
      console.log(err)
    }
  },
  deleteShift: async (req, res) => {
    try {
      await Shift.findOneAndDelete({ _id: req.body.shiftID })
      console.log('Shift deleted')
      res.json('Shift deleted')
    } catch(err) {
    console.log(err)
    }
  },
} 
