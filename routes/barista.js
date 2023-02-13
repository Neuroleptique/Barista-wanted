const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const shiftsController = require("../controllers/shifts");
const accountsController = require("../controllers/accounts");

router.put("/putAvailable", shiftsController.putAvailable);
router.put("/removeAvailable", shiftsController.removeAvailable);
router.put("/profile_barista", upload.single("file"), accountsController.updateProfileBarista);
router.get("/signuploadform", accountsController.getSignature);
router.put("/putPhotoInfo", accountsController.putPhotoInfo);
router.delete("/deleteCloudPhoto", accountsController.deleteCloudPhoto)

module.exports = router;