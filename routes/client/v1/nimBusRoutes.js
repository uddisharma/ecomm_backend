const express = require("express");
const router = express.Router();
const nimBusController = require("../../../controller/client/v1/nimBusController");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const checkRolePermission = require("../../../middleware/checkRolePermission");

router.route("/client/nimbus/login").post(nimBusController.Login);

router
  .route("/client/nimbus/create-shipment")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    nimBusController.CancelShipment
  );

router
  .route("/client/nimbus/track-order")
  .post(auth(PLATFORM.ADMIN), checkRolePermission, nimBusController.TrackOrder);

router
  .route("/client/nimbus/track-bulk-orders")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    nimBusController.TrackBulkOrders
  );

router
  .route("/client/nimbus/manifest")
  .post(auth(PLATFORM.ADMIN), checkRolePermission, nimBusController.Manifest);

router
  .route("/client/nimbus/cancel-shipment")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    nimBusController.CancelShipment
  );

router
  .route("/client/nimbus/create-hyper-local-shipment")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    nimBusController.CreateHyperLocalShipment
  );

router.route("/client/nimbus/check-service").post(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  nimBusController.CheckServiceAndRate
);

router.route("/client/nimbus/check-service-rates").post(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  nimBusController.getDeliveryRates
);

module.exports = router;
