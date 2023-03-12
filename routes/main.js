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
router.get("/confirmation/:email/:token", authController.confirmEmail);
router.get("/resend_email_confirmation", authController.getResendEmailconfirmation)
router.post("/resend_email_confirmation", authController.postResendEmailconfirmation);
router.get("/password_reset_request", authController.getPasswordResetRequest);
router.post("/password_reset_request", authController.postPasswordResetRequest);
router.get("/password-reset/:userId/:token", authController.getPasswordResetActual);
router.post("/password-reset/:userId/:token", authController.postPasswordResetActual)
router.get("/getDemo", ensureGuest, authController.getDemo)
router.post("/demoBaristaLogin", authController.postLogin)
router.post('/demoCafeLogin', authController.postLogin)

// Profile from dashboard
router.get("/profile", ensureAuth, accountsController.getProfile);

module.exports = router;