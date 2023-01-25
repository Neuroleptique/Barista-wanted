const express = require("express");
const router = express.Router();
const shiftsController = require("../controllers/shifts");
const accountsController = require("../controllers/accounts");

router.post("/postShift", shiftsController.postShift);
router.put("/inactiveShift", shiftsController.inactiveShift);
router.delete("/deleteShift", shiftsController.deleteShift);
router.put("/putAddressCafe", accountsController.addAddressCafe);

module.exports = router;