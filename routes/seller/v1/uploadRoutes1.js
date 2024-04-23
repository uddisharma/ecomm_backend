const express = require("express");
const router = express.Router();
const fileUploadController = require("../../../controller/seller/v1/fileUploadController1");
const authenticateJWT = require("../../../middleware/loginUser");
const { PLATFORM } = require("../../../constants/authConstant");

router.post(
  "/seller/upload",
  authenticateJWT(PLATFORM.DEVICE),
  fileUploadController.upload
);

module.exports = router;
