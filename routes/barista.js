const express = require("express");
const router = express.Router();
const shiftsController = require("../controllers/shifts");
const accountsController = require("../controllers/accounts");

router.put("/putAvailable", shiftsController.putAvailable);
router.put("/removeAvailable", shiftsController.removeAvailable);
router.put("/profile_barista", accountsController.updateProfileBarista);
router.get("/signuploadform", accountsController.getSignature);
router.put("/putPhotoInfo", accountsController.putPhotoInfo);
router.delete("/deleteCloudPhoto", accountsController.deleteCloudPhoto)

module.exports = router;