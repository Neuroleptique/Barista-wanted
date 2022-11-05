const cloudinary = require("../middleware/cloudinary");
const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift")

module.exports = {
  postShift: async (req, res) => {
    // console.log(req)
    try {
      const cafeData = await Cafe.findOne({ userID: req.user._id })
      console.log(cafeData)
      await Shift.create({
        userID: req.body.userID,
        shopName: cafeData.shopName,
        location: req.body.location,
        wage: req.body.wage,
        date: req.body.date,
        from_time: req.body["from-time"],
        end_time: req.body["end-time"],
        activeStatus: req.body.activeStatus,
        more: req.body.more,

      })
      console.log('Shift created!')
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
    }
  }
};
