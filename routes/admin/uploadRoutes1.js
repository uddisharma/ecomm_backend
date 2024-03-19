/**
 * uploadRoutes.js
 * @description :: routes of upload/download attachment
 */

const express = require("express");
const router = express.Router();
const fileUploadController = require("../../controller/admin/fileUploadController1");
const auth = require("../../middleware/auth");
const { PLATFORM } = require("../../constants/authConstant");

router.post("/admin/upload", fileUploadController.upload);

module.exports = router;
