const express = require("express");
const router = express.Router();
const nimBusController = require("../../controller/admin/nimBusController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router.route("/admin/nimbus/login").post(nimBusController.Login);

router
  .route("/admin/nimbus/create-shipment")
  .post(authenticateJWT(PLATFORM.ADMIN), nimBusController.CancelShipment);

router
  .route("/admin/nimbus/track-order")
  .post(authenticateJWT(PLATFORM.ADMIN), nimBusController.TrackOrder);

router
  .route("/admin/nimbus/track-bulk-orders")
  .post(authenticateJWT(PLATFORM.ADMIN), nimBusController.TrackBulkOrders);

router
  .route("/admin/nimbus/manifest")
  .post(authenticateJWT(PLATFORM.ADMIN), nimBusController.Manifest);

router
  .route("/admin/nimbus/cancel-shipment")
  .post(authenticateJWT(PLATFORM.ADMIN), nimBusController.CancelShipment);

router
  .route("/admin/nimbus/create-hyper-local-shipment")
  .post(
    authenticateJWT(PLATFORM.ADMIN),
    nimBusController.CreateHyperLocalShipment
  );

router
  .route("/admin/nimbus/check-service")
  .post(authenticateJWT(PLATFORM.ADMIN), nimBusController.CheckServiceAndRate);

module.exports = router;
