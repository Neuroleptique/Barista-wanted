const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Barista = require("../models/Barista");
const Cafe = require("../models/Cafe");
const Token = require("../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const bcryptSalt = process.env.BCRYPT_SALT;
const sendEmail = require("./email");
const {verify} = require("hcaptcha")


exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/dashboard", { user: req.user });
  }
  res.render("login", {
    title: "Login",
    user: req.user
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);     
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/dashboard");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.session.regenerate(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignupBarista = (req, res) => {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  
  res.render("signup_barista", {
    title: "Create Account",
    user: req.user
  });
};

exports.getSignupCafe = (req, res) => {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  
  res.render("signup_cafe", {
    title: "Create Account",
    user: req.user
  });
};

exports.postSignup = async (req, res, next) => {
  
  // Input Validation
  const validationErrors = [];
  if (!validator.isLength(req.body.userName, {min:3, max:25 }))
    validationErrors.push({ msg: "Username must be between 3 to 25 characters" });
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({ msg: "Password must be at least 8 characters long" });
  if (!validator.equals(req.body.password, req.body.confirmPassword))
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    if ( req.body.userType == 'barista' ) {
      return res.redirect("../signup_barista");
    } else if ( req.body.userType == 'cafe' ) {
      return res.redirect("../signup_cafe");
    }
  }

  try {
    // verify hCaptcha Token validity
    const hCaptchaSecret = process.env.HCAPTCHA_SECRET;
    const hCaptchaToken = req.body["h-captcha-response"];

    let data = await verify(hCaptchaSecret, hCaptchaToken)

    if (!data.success) {
      console.log('verification failed');
      req.flash("errors", {
        msg: "Human verification failed",
      });
      if ( req.body.userType == 'barista' ) {
        return res.redirect("/signup_barista");
      } else if ( req.body.userType == 'cafe' ) {
        return res.redirect("/signup_cafe");
      }
    }

    // Email and userName sanitization
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
      all_lowercase: true
    });
    
    req.body.userName

    // Verify if user name or email already exist
    const existingUser = await User.findOne(
      { $or: [{ email: req.body.email }, { userName: req.body.userName }] }
    );

    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.redirect("../login");
    }
      
    // Add new user to User collection
    const user = new User({
      userName: req.body.userName.toLowerCase(),
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
    });

    // Create document in barista/cafe collection according to userType
    if (req.body.userType == 'barista') {
      await Barista.create({ userName: req.body.userName, email: req.body.email })
    } else if (req.body.userType == 'cafe') {
      await Cafe.create({ userName: req.body.userName, email: req.body.email, cafeName: req.body.cafeName })
    }
    
    await user.save();

    // Generate email validation token and store in Token collection
    const token = new Token({
      _userId: user._id, 
      token: crypto.randomBytes(16).toString('hex'),
    })
    
    await token.save()

    // Send account verification email to user
    const subject = 'Barista Wanted account Verification'
    const text = 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/'+ req.body.email + '\/' + token.token + '\n\nThank You!\n'
    sendEmail( req.body.email, subject, text )
    
    req.flash('success', {
      msg: 'Please check your email and verify your account.'
    });
    res.redirect('/login')  

  } catch(err) {
    console.log(err)
  }
};

exports.confirmEmail = (req, res) => {

  if (!validator.isEmail(req.params.email)){
    req.flash("errors", { msg: "Email is not valid." })
    res.redirect('/login')
  };
    
  Token.findOneAndDelete({ token: req.params.token }, (err, token) => {
    if (err) {
      return next(err);
    }
    if (!token){
      req.flash('errors', { msg: 'We were unable to find a valid token. Your token may have expired.' })
      res.redirect('/resend_email_confirmation')
    } else {
      User.findOne({ _id: token._userId, email: req.params.email }, (err, user) => {

        if (!user) {
          req.flash('errors', { msg: "No account with that email address exists." })
          return res.redirect('/login')
        }
        if (user.isVerified) {
          req.flash('info', { msg: 'Your account has already been verified. Please log in.' })
          return res.redirect('/login')
        }
        user.isVerified = true;
        user.save((err) => {
          if(err) {
            return next(err)
          }
          req.flash('success', {
            msg: "The account has been verified. Please log in."
          });
          res.redirect('/login')
        })
      })
    }
  })
};

exports.getResendEmailconfirmation = (req, res) => {
  res.render("resend_email.ejs", { user: req.user });
};

exports.postResendEmailconfirmation = (req, res, next) => { 
  if (!validator.isEmail(req.body.email)) {
    req.flash("errors", { msg: "Please enter a valid email address." })
    res.redirect('/login')
  };
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
    all_lowercase: true
  });

  User.findOne( { email: req.body.email }, (err, user) => {
    if (!user) {
      req.flash('errors',{ msg: "No account with that email address exists." })
      return res.redirect('/login')
    }
    if (user.isVerified) {
      req.flash('info', { msg: 'Your account has already been verified. Please log in.' })
      return res.redirect('/login')
    }
    const token = new Token({
      _userId: user._id, 
      token: crypto.randomBytes(16).toString('hex'),
    })

    token.save(err => {
      if(err) {
        return next(err)
      }
      const subject = 'Barista Wanted account Verification'
      const text = 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/'+ req.body.email + '\/' + token.token + '\n\nThank You!\n'
      sendEmail( req.body.email, subject, text )

    })
    req.flash('info', {
      msg: `A verification email has been sent to ${user.email}. Please check your email and verify your account.`
    });
    res.redirect('/login')
  })
};

exports.getPasswordResetRequest = (req, res) => {
  res.render("password_reset_request.ejs", { user: req.user });
};

exports.postPasswordResetRequest = async (req, res) => {
  if (!validator.isEmail(req.body.email)) {
    req.flash("errors", { msg: "Please enter a valid email address." })
    return res.redirect('/password_reset_request')
  };
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
    all_lowercase: true
  });
  User.findOne( { email: req.body.email }, (err, user) => {
    if (!user) {
      req.flash('errors', { msg: "No account with that email address exists." })
      return res.redirect('/password_reset_request')
    }

    const token = new Token({
      _userId: user._id, 
      token: crypto.randomBytes(20).toString('hex'),
    })
    
    token.save(err => {
      if(err) {
        return next(err)
      }
      const subject = 'Barista Wanted Password Reset Request'
      const text = 'Your are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n' +
      'Please reset your account password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/password-reset\/'+ user._id + '\/' + token.token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'

      sendEmail( user.email, subject, text )

    })
    req.flash('info', {
      msg: `A password reset request has been sent to ${user.email}.`
    });
    res.redirect('/password_reset_request')
  })
}

exports.getPasswordResetActual = async (req, res) => {
  try{
    const passwordResetToken = await Token.findOne({ _userId: req.params.userId })
    if(!passwordResetToken) {
      req.flash("errors", {
        msg: "Invalid or expired password reset token"
      })
      return res.redirect('/password_reset_request')
    }
    if(!validator.equals(passwordResetToken.token, req.params.token) ) {
      req.flash("errors", {
        msg: "Invalid or expired password reset token"
      })
      return res.redirect('/password_reset_request')
    }
    res.render("password_reset.ejs", { user: req.user });
  }catch(err){
    console.log(err)
  }
}

exports.postPasswordResetActual = async (req, res) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 8 }))
  validationErrors.push({
    msg: "Password must be at least 8 characters long",
  });
  if (!validator.equals(req.body.password, req.body.confirmPassword))
    validationErrors.push({ msg: "Passwords do not match" });
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect(`/password-reset/${req.params.userId}/${req.params.token}`)
  }
  try{
    const passwordResetToken = await Token.findOne({ _userId: req.params.userId })
    if(!passwordResetToken) {
      req.flash("errors", {
        msg: "Invalid or expired password reset token"
      })
      return res.redirect('/password_reset_request')
    }
    if(!validator.equals( passwordResetToken.token, req.params.token) ) {
      req.flash("errors", {
        msg: "Invalid or expired password reset token"
      })
      return res.redirect('/password_reset_request')
    }
    if(passwordResetToken) await passwordResetToken.deleteOne()
    const hashedPassword = await bcrypt.hash( req.body.password, Number(bcryptSalt) )
    await User.findByIdAndUpdate( req.params.userId, {
      password: hashedPassword 
    }, { runValidators: true } )
    req.flash('success', {
      msg: "You have successfully reset your password. Please login to your account."
    });
    
    res.redirect('/login')
  }catch(err){
    console.log(err)
  }
}