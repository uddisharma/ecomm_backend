/**
 * uploadRoutes.js
 * @description :: routes of upload/download attachment
 */

const express = require('express');
const router = express.Router();
const fileUploadController = require('../../../controller/seller/v1/fileUploadController');

router.post('/seller/api/v1/upload',fileUploadController.upload);

module.exports = router;