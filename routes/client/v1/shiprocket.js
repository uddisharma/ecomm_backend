const express = require("express");
const router = express.Router();
const shiprocketController = require("../../../controller/client/v1/shiprocket");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router
  .route("/client/api/v1/shiprocket/token")
  .post(authenticateJWT(PLATFORM.CLIENT), shiprocketController.GetToken);

router
  .route("/client/api/v1/shiprocket/check-service")
  .post(authenticateJWT(PLATFORM.CLIENT), shiprocketController.checkservice);

router
  .route("/client/api/v1/shiprocket/create-order")
  .post(authenticateJWT(PLATFORM.CLIENT), shiprocketController.createOrder);

module.exports = router;
