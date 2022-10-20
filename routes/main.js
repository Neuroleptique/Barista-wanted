const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/baristaprofile", ensureAuth, postsController.getProfile);
// router.get("/baristafeed", ensureAuth, postsController.getFeed);
router.get("/baristalogin", authController.getLogin);
router.post("/baristalogin", authController.postLogin);
router.get("/baristalogout", authController.logout);
// router.get("/ownersignup", authController.getSignup);
// router.post("/ownersignup", authController.postSignup);
router.get("/baristasignup", authController.getSignup);
router.post("/baristasignup", authController.postSignup);

module.exports = router;