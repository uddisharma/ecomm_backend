const express = require("express");
const router = express.Router();
const delhiveryController = require("../../controller/admin/delhiveryController");
const { PLATFORM } = require("../../constants/authConstant");
const auth = require("../../middleware/auth");
const checkRolePermission = require("../../middleware/checkRolePermission");

router
  .route("/admin/delhivery/check-service")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    delhiveryController.checkservice
  );

router
  .route("/admin/delhivery/track-order")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    delhiveryController.trackOrder
  );

router
  .route("/admin/delhivery/order-slip")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    delhiveryController.orderSlip
  );
router
  .route("/admin/delhivery/pickup-request")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    delhiveryController.pickupRequest
  );

router
  .route("/admin/delhivery/create-warehouse")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    delhiveryController.createwareHouse
  );

router
  .route("/admin/delhivery/calculate-shipping")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    delhiveryController.calculateShipping
  );

router
  .route("/admin/delhivery/create-order")
  .post(delhiveryController.createOrder);
module.exports = router;
