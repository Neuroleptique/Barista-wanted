const express = require("express");
const router = express.Router();
const accountController = require('../controllers/account')

router.put('/profile_barista', accountController.updateProfile)

module.exports = router;