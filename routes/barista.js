const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const shiftsController = require("../controllers/shifts");
const accountsController = require("../controllers/accounts");

router.put("/putAvailable", shiftsController.putAvailable);
router.put("/removeAvailable", shiftsController.removeAvailable);
router.put("/profile_barista", upload.single("file"), accountsController.updateProfileBarista);

module.exports = router;