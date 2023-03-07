const express = require("express");
const router = express.Router();
const shiftsController = require("../controllers/shifts");
const accountsController = require("../controllers/accounts");

router.post("/postShift", shiftsController.postShift);
router.put("/inactiveShift", shiftsController.inactiveShift);
router.put("/putCafeDisplayFalse", shiftsController.putCafeDisplayFalse)
router.put("/putAddressCafe", accountsController.addAddressCafe);
router.put("/profile_cafe", accountsController.updateProfileCafe);

module.exports = router;