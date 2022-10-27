const express = require("express");
const router = express.Router();
const accountController = require('../controllers/account');
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.put("/profile_barista", ensureAuth, accountController.updateProfile)

module.exports = router;