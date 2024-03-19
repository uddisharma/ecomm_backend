/**
 * orderRoutes.js
 * @description :: CRUD API routes for order
 */

const express = require("express");
const router = express.Router();
const orderController = require("../../../controller/seller/v1/orderController");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const checkRolePermission = require("../../../middleware/checkRolePermission");
const authenticateJWT = require("../../../middleware/loginUser");

router
  .route("/seller/api/v1/order/create")
  .post(auth(PLATFORM.DEVICE), checkRolePermission, orderController.addOrder);
router
  .route("/seller/api/v1/order/list/")
  .get(authenticateJWT(PLATFORM.DEVICE), orderController.findAllOrder);

router.route("/seller/api/v1/order/deleted/list/:id").get(
  // auth(PLATFORM.DEVICE),
  // checkRolePermission,
  orderController.findAllDeletedOrder
);

router
  .route("/seller/api/v1/order/count")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    orderController.getOrderCount
  );
router
  .route("/seller/api/v1/order/:id")
  .get(authenticateJWT(PLATFORM.DEVICE), orderController.getOrder);
router
  .route("/seller/api/v1/order/update/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), orderController.updateOrder);
router
  .route("/seller/api/v1/order/partial-update/:id")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    orderController.partialUpdateOrder
  );
router
  .route("/seller/api/v1/order/softDelete/:id")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    orderController.softDeleteOrder
  );
router
  .route("/seller/api/v1/order/softDeleteMany")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    orderController.softDeleteManyOrder
  );
router
  .route("/seller/api/v1/order/addBulk")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    orderController.bulkInsertOrder
  );
router
  .route("/seller/api/v1/order/updateBulk")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    orderController.bulkUpdateOrder
  );
router
  .route("/seller/api/v1/order/delete/:id")
  .delete(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    orderController.deleteOrder
  );

router
  .route("/seller/api/v1/order/deleteMany")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    orderController.deleteManyOrder
  );

router
  .route("/seller/api/v1/order/revenue/monthwise")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    orderController.getYearlySellerRevenue
  );

router
  .route("/seller/api/v1/order/orders/monthwise")
  .get(authenticateJWT(PLATFORM.DEVICE), orderController.getYearlySellerOrders);

router
  .route("/seller/api/v1/order/revenue/datewise")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    orderController.getTotalSalesForSellerAndDate
  );

router
  .route("/seller/api/v1/counts")
  .get(authenticateJWT(PLATFORM.DEVICE), orderController.getCounts);

router
  .route("/seller/api/v1/last-seven-days/:seller")
  .get(orderController.sevenDaysOrder);

module.exports = router;
