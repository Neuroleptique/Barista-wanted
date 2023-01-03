const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Barista = require("../models/Barista")
const Cafe = require("../models/Cafe")
const Token = require("../models/Token")
const crypto = require("crypto");
const sendEmail = require("./email");


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
      // if (req.user.userType == 'barista') {
      //   return res.redirect("/login_barista");
      // } else {
      //   return res.redirect("/login_cafe");
      // }
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
  
  try {
    // Input Validation
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (!validator.isLength(req.body.password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    if (req.body.password !== req.body.confirmPassword)
      validationErrors.push({ msg: "Passwords do not match" });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      if ( req.user.userType == 'barista' ) {
        return res.redirect("../signup_barista");
      } else if ( req.user.userType == 'cafe' ) {
        return res.redirect("../signup_cafe");
      }
    }

    // Verify if user name or email already exist
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });
    
    User.findOne(
      { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
      (err, existingUser) => {
        if (err) {
          return next(err);
        }
        if (existingUser) {
          req.flash("errors", {
            msg: "Account with that email address or username already exists.",
          });
          return res.redirect("../login");
        }
      }
    );

    // Add new user 
    const user = new User({
      userName: req.body.userName.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      userType: req.body.userType,
    });
    // Create user profile according to userType
    if (req.body.userType == 'barista') {
      await Barista.create({ userName: req.body.userName, email: req.body.email })
    } else if (req.body.userType == 'cafe') {
      await Cafe.create({ userName: req.body.userName, email: req.body.email, cafeName: req.body.cafeName })
    }
    
    user.save((err) => {
      if (err) {
        return next(err);
      }
      const token = new Token({
        _userId: user._id, 
        token: crypto.randomBytes(16).toString('hex') 
      })
      
      token.save((err) => {
        if (err) {
          return next(err)
        }
        const subject = 'Barista Wanted account Verification'
        const text = 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/'+ req.body.email + '\/' + token.token + '\n\nThank You!\n'
        sendEmail( req.body.email, subject, text )
      })
      req.flash('info', {
        msg: 'Please check your email and verify your account.'
      });
      res.redirect('../login')

    });

  } catch(err) {
    console.log(err)
  }

};

exports.confirmEmail = (req, res) => {
  console.log(req.params)
  Token.findOne({ token: req.params.token }, (err, token) => {

    if (!token){
      req.flash('error',{ msg: 'We were unable to find a valid token. Your token my have expired.' })
      res.redirect('/')
    } else {
      User.findOne({ _id: token._userId, email: req.params.email }, (err, user) => {

        if (!user) {
          req.flash('error',{ msg: "No account with that email address exists." })
          return res.redirect('/')
        }
        if (user.isVerified) {
          req.flash('error', { msg: 'Your account has already been verified.' })
          return res.redirect('/login')
        }
        
        user.isVerified = true;
        user.save((err) => {
          if(err) {
            return next(err)
          }
          req.flash('info', {
            msg: "The account has been verified. Please log in."
          });
          res.redirect('/login')
        })
      })
    }

  })
}
