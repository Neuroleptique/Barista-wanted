const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift")
const nodemailer = require('nodemailer');
const sendEmail = require("./email");

module.exports = {
  postShift: async (req, res) => {
    try {
      const shiftDateAndTime = new Date(req.body.date)
      // Retrieve shift start time from Date as hh:mm format
      const start_time = `${shiftDateAndTime.getHours().toString().padStart(2, '0')}:${shiftDateAndTime.getMinutes().toString().padStart(2, '0')}`

      const cafeData = await Cafe.findOne({ userName: req.user.userName })
      const locationData = cafeData.place.filter(p => p.place_id == req.body.location)[0]
      console.log(locationData)
      await Shift.create({
        _userID: req.user.id,
        cafeUserName: req.user.userName,
        cafeName: cafeData.cafeName,
        location: locationData,
        wage: req.body.wage,
        tips: req.body.tips,
        date: req.body.date,
        start_time: start_time,
        end_time: req.body.end_time,
        activeStatus: req.body.activeStatus,
        more: req.body.more,
      })

      // Sent email to baristas who opt in for email notification
      const baristas = await Barista.find({ notification: true })

      if(baristas) {
        const baristaEmails = baristas.map(b => b.email)       
        const shiftDate = shiftDateAndTime.toDateString()

        // Send notification email to baristas
        const subject = `Barista Wanted: ${cafeData.cafeName} is looking for barista`
        const text = `${cafeData.cafeName} is looking for a barista on \n${shiftDate} from ${start_time} to ${req.body.end_time}.\nPlease login to your account for more info by clicking the link: \nhttp:\/\/`+ req.headers.host + "\/dashboard"
        
        sendEmail( baristaEmails, subject, text )
      }
      
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

  // Triggering condition: only if availability.length == 0 && ownerDisplay == false
  deleteShift: async (req, res) => {
    try {
      await Shift.findOneAndDelete({ _id: req.body.shiftID })
      console.log('Shift deleted')

    } catch(err) {
    console.log(err)
    }
  },
  putCafeDisplayFalse: async (req, res) => {
    try {
      const shiftData = await Shift.findOneAndUpdate( {_id: req.body.shiftID }, {
        ownerDisplay: false
      }, { new: true })
      if( shiftData.availability.length == 0 ) {
        module.exports.deleteShift(req)
      }
      console.log('Shift removed from cafe dashboard')
      res.json('Shift removed from cafe dashboard')
    } catch (error) {
      console.error(error) 
    }
  },
  putAvailable: async(req, res) => {
    try {
      await Shift.findOneAndUpdate({ _id: req.body.shiftID }, {
        $push: { availability: req.user.userName }
      })
      console.log(`${req.user.userName} is available for the shift`)
      res.json('Candidate added')
    } catch(err) {
      console.log(err)
    }
  },
  removeAvailable: async(req, res) => {
    try {
      const shiftData = await Shift.findOneAndUpdate({ _id: req.body.shiftID }, {
        $pull: { availability: req.user.userName }
      }, { new: true })

      if (shiftData.availability.length == 0 && shiftData.ownerDisplay == false) {
        module.exports.deleteShift(req)
      }
      console.log(`${req.user.userName} is no longer available for the shift`)
      res.json('Candidate removed')
    }catch(err){
      console.log(err)
    }
  }
} 