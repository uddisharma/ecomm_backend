const express = require("express");
const router = express.Router();
const delhiveryController = require("../../controller/admin/delhiveryController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router.route("/admin/delhivery/check-service").post(
  authenticateJWT(PLATFORM.ADMIN),
  delhiveryController.checkservice
);

router.route("/admin/delhivery/track-order").post(
  authenticateJWT(PLATFORM.ADMIN),
  delhiveryController.trackOrder
);

router.route("/admin/delhivery/order-slip").post(
  authenticateJWT(PLATFORM.ADMIN),
  delhiveryController.orderSlip
);

router.route("/admin/delhivery/pickup-request").post(
  authenticateJWT(PLATFORM.ADMIN),
  delhiveryController.pickupRequest
);

router.route("/admin/delhivery/create-warehouse").post(
  authenticateJWT(PLATFORM.ADMIN),
  delhiveryController.createwareHouse
);

router.route("/admin/delhivery/calculate-shipping").post(
  authenticateJWT(PLATFORM.ADMIN),
  delhiveryController.calculateShipping
);

router
  .route("/admin/delhivery/create-order")
  .post(authenticateJWT(PLATFORM.ADMIN), delhiveryController.createOrder);


module.exports = router;
