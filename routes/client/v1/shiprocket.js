const express = require("express");
const router = express.Router();
const shiprocketController = require("../../../controller/client/v1/shiprocket");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const checkRolePermission = require("../../../middleware/checkRolePermission");

router
  .route("/client/api/v1/shiprocket/token")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    shiprocketController.GetToken
  );

router
  .route("/client/api/v1/shiprocket/check-service")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    shiprocketController.checkservice
  );

router
  .route("/client/api/v1/shiprocket/create-order")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    shiprocketController.createOrder
  );

module.exports = router;
