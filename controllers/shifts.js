const cloudinary = require("../middleware/cloudinary");
const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const Shift = require("../models/Shift")
const nodemailer = require('nodemailer')

module.exports = {
  postShift: async (req, res) => {
    try {
      // create shift to database
      const cafeData = await Cafe.findOne({ userName: req.user.userName })
      await Shift.create({
        userID: req.user._id,
        cafeName: cafeData.cafeName,
        location: req.body.location,
        wage: req.body.wage,
        date: req.body.date,
        end_time: req.body.end_time,
        activeStatus: req.body.activeStatus,
        more: req.body.more,
      })
      // Sent email to baristas who opt in for email notification
      const baristas = await Barista.find({ notification: true })
      const baristaEmails = baristas.map(b => b.email)
      // Retrive date and start time
      const shiftDate = new Date(req.body.date)
      const shiftStartTime = `${shiftDate.getHours().toString().padStart(2, '0')}:${shiftDate.getMinutes().toString().padStart(2, '0')}`
      console.log(shiftStartTime)

      if(baristas){
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PWD
          }
        })
        const mailOptions = {
            to: baristaEmails,
            from: process.env.MAIL_USER,
            subject: 'Barista Wanted: New shift available',
            text: `${cafeData.cafeName} is looking for barista at ${req.body.location} on ${shiftDate.toDateString()} for ${shiftStartTime} - ${req.body.end_time}.\n Please login to your profile for more info.`
        };
        transporter.sendMail(mailOptions, function (err) {
            req.flash('info', 'An e-mail has been sent to ' + baristaEmails + ' with further instructions.');
            done(err, 'done');
        });
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
  deleteShift: async (req, res) => {
    try {
      await Shift.findOneAndDelete({ _id: req.body.shiftID })
      console.log('Shift deleted')
      res.json('Shift deleted')
    } catch(err) {
    console.log(err)
    }
  },
  emailNotification: async (req, res) => {
    try {
      const baristas = await User.find({ userType: "barista" })
      console.log(baristas)
      console.log('email sent')
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PWD
        }
      })
      const mailOptions = {
          to: req.user.email,
          from: process.env.MAIL_USER,
          subject: 'Barista Wanted: New shift available',
          text: '' + 
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      await transporter.sendMail(mailOptions, function (err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
      });
    } catch(err) {
      console.log(err)
    }
  }
} 
