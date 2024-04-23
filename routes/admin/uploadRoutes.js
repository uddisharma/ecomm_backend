const express = require("express");
const router = express.Router();
const fileUploadController = require("../../controller/admin/fileUploadController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router.post(
  "/admin/upload",
  authenticateJWT(PLATFORM.ADMIN),
  fileUploadController.upload
);

module.exports = router;
