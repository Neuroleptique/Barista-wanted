const express = require("express");
const router = express.Router();
const shiftsController = require("../controllers/shifts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/postShift", shiftsController.postShift);
router.put("/inactiveShift", shiftsController.inactiveShift);
router.delete("/deleteShift", shiftsController.deleteShift)

module.exports = router;