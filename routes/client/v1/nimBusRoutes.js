const express = require("express");
const router = express.Router();
const nimBusController = require("../../../controller/client/v1/nimBusController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router.route("/client/nimbus/login").post(nimBusController.Login);

router
  .route("/client/nimbus/create-shipment")
  .post(authenticateJWT(PLATFORM.CLIENT), nimBusController.CancelShipment);

router.route("/client/nimbus/track-order").post(
  authenticateJWT(PLATFORM.CLIENT),

  nimBusController.TrackOrder
);

router
  .route("/client/nimbus/track-bulk-orders")
  .post(authenticateJWT(PLATFORM.CLIENT), nimBusController.TrackBulkOrders);

router.route("/client/nimbus/manifest").post(
  authenticateJWT(PLATFORM.CLIENT),

  nimBusController.Manifest
);

router
  .route("/client/nimbus/cancel-shipment")
  .post(authenticateJWT(PLATFORM.CLIENT), nimBusController.CancelShipment);

router
  .route("/client/nimbus/create-hyper-local-shipment")
  .post(
    authenticateJWT(PLATFORM.CLIENT),
    nimBusController.CreateHyperLocalShipment
  );

router
  .route("/client/nimbus/check-service")
  .post(authenticateJWT(PLATFORM.CLIENT), nimBusController.CheckServiceAndRate);

router
  .route("/client/nimbus/check-service-rates")
  .post(authenticateJWT(PLATFORM.CLIENT), nimBusController.getDeliveryRates);

module.exports = router;
