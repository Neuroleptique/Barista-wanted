const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/dashboard", ensureAuth, postsController.getDashboard);
router.get("/login_barista", authController.getLogin);
router.post("/login_barista", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup_barista", authController.getSignupBarista);
router.post("/signup_barista", authController.postSignup);
router.get("/signup_cafe", authController.getSignupCafe);
router.post("/signup_cafe", authController.postSignup);

// Get Profile from dashboard  
router.get("/profile_barista", ensureAuth, postsController.getProfile);
router.put("/profile_barista", ensureAuth, postsController.updateProfileBarista);
router.get("/profile_cafe", ensureAuth, postsController.getProfile);
// router.put("/profile_cafe", ensureAuth, postsController.updateProfile);


module.exports = router;