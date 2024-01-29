const express = require("express");
const router = express.Router();
const nimBusController = require("../../controller/admin/nimBusController");
const { PLATFORM } = require("../../constants/authConstant");
const auth = require("../../middleware/auth");
const checkRolePermission = require("../../middleware/checkRolePermission");

router.route("/admin/nimbus/login").post(nimBusController.Login);

router
  .route("/admin/nimbus/create-shipment")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    nimBusController.CancelShipment
  );

router
  .route("/admin/nimbus/track-order")
  .post(auth(PLATFORM.ADMIN), checkRolePermission, nimBusController.TrackOrder);

router
  .route("/admin/nimbus/track-bulk-orders")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    nimBusController.TrackBulkOrders
  );

router
  .route("/admin/nimbus/manifest")
  .post(auth(PLATFORM.ADMIN), checkRolePermission, nimBusController.Manifest);

router
  .route("/admin/nimbus/cancel-shipment")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    nimBusController.CancelShipment
  );

router
  .route("/admin/nimbus/create-hyper-local-shipment")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    nimBusController.CreateHyperLocalShipment
  );

router.route("/admin/nimbus/check-service").post(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  nimBusController.CheckServiceAndRate
);

module.exports = router;
