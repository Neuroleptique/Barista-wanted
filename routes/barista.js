const express = require("express");
const router = express.Router();
const shiftsController = require("../controllers/shifts");

router.put("/putAvailable", shiftsController.putAvailable);
router.put("/removeAvailable", shiftsController.removeAvailable);

module.exports = router;