const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Barista = require("../models/Barista")
const Cafe = require("../models/Cafe")


exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login",
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
    // if (req.user.userType == 'barista') {
    //   return res.redirect("/login_barista");
    // } else {
    //   return res.redirect("/login_cafe");
    // }
      
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
  });
};

exports.getSignupCafe = (req, res) => {
  if (req.user) {
    return res.redirect("/dashboard");
  }
  
  res.render("signup_cafe", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  console.log(req)
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
    if (req.user.userType == 'barista') {
      return res.redirect("../signup_barista");
    } else {
      return res.redirect("../signup_cafe");
    }
    // return res.redirect("../signup_barista");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    userType: req.body.userType,
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
  user.save((err) => {
    if (err) {
      return next(err);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Create profile according to userType
      if (req.body.userType == 'barista') {
        Barista.create({ userName: req.body.userName })
      } else if (req.body.userType == 'cafe') {
        Cafe.create({ userName: req.body.userName })
      }
      res.redirect("../dashboard");
    });
  });


};
