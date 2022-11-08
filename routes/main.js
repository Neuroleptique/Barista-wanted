const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const accountsController = require("../controllers/accounts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Main Routes
router.get("/", homeController.getIndex);
router.get("/dashboard", ensureAuth, accountsController.getDashboard);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup_barista", authController.getSignupBarista);
router.post("/signup_barista", authController.postSignup);
router.get("/signup_cafe", authController.getSignupCafe);
router.post("/signup_cafe", authController.postSignup);

// Profile from dashboard
router.get("/profile_barista", ensureAuth, accountsController.getProfile);
router.put("/profile_barista", ensureAuth, accountsController.updateProfileBarista);
router.get("/profile_cafe", ensureAuth, accountsController.getProfile);
router.put("/profile_cafe", ensureAuth, accountsController.updateProfileCafe);


module.exports = router;