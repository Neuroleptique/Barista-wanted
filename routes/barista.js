const express = require("express");
const router = express.Router();
const shiftsController = require("../controllers/shifts");

router.put("/putAvailable", shiftsController.putAvailable);

module.exports = router;