/**
 * orderRoutes.js
 * @description :: CRUD API routes for order
 */

const express = require("express");
const router = express.Router();
const orderController = require("../../controller/admin/orderController");
const auth = require("../../middleware/auth");
const checkRolePermission = require("../../middleware/checkRolePermission");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router
  .route("/admin/order/create")
  .post(auth(PLATFORM.ADMIN), checkRolePermission, orderController.addOrder);
router
  .route("/admin/order/list")
  .get(authenticateJWT(PLATFORM.ADMIN), orderController.findAllOrder);
router
  .route("/admin/order/count")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.getOrderCount
  );
router
  .route("/admin/order/count/today")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.getOrderCountForCurrentDate
  );
router
  .route("/admin/order/:id")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.getOrder
  );
router
  .route("/admin/order/update/:id")
  .patch(
    authenticateJWT(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.updateOrder
  );
router
  .route("/admin/order/partial-update/:id")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.partialUpdateOrder
  );
router
  .route("/admin/order/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), orderController.softDeleteOrder);
router
  .route("/admin/order/softDeleteMany")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.softDeleteManyOrder
  );
router
  .route("/admin/order/addBulk")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.bulkInsertOrder
  );
router
  .route("/admin/order/updateBulk")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.bulkUpdateOrder
  );
router
  .route("/admin/order/delete/:id")
  .delete(authenticateJWT(PLATFORM.ADMIN), orderController.deleteOrder);
router
  .route("/admin/order/deleteMany")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    orderController.deleteManyOrder
  );

router.get(
  "/admin/order/user/:customerId",
  authenticateJWT(PLATFORM.ADMIN),
  orderController.getAllOrdersByUser
);

router.get(
  "/admin/stats/count",
  authenticateJWT(PLATFORM.ADMIN),
  orderController?.getCounts
);

router.get(
  "/admin/seller/stats/count/:id",
  authenticateJWT(PLATFORM.ADMIN),
  orderController?.getSellerCounts
);

router
  .route("/admin/order/revenue/datewise")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    orderController.getTotalSalesForSellerAndDate
  );

router
  .route("/admin/seller/order/revenue/datewise/:id")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    orderController.getTotalSalesForSellerAndDate1
  );

router
  .route("/admin/order/revenue/monthwise")
  .get(authenticateJWT(PLATFORM.ADMIN), orderController.getYearlySellerRevenue);

router
  .route("/admin/seller/order/revenue/monthwise/:id")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    orderController.getYearlySellerRevenue1
  );

router
  .route("/admin/order/orders/monthwise")
  .get(authenticateJWT(PLATFORM.ADMIN), orderController.getYearlySellerOrders);

router
  .route("/admin/seller/order/orders/monthwise/:id")
  .get(authenticateJWT(PLATFORM.ADMIN), orderController.getYearlySellerOrders1);

router
  .route("/admin/seller/order/list/:id")
  .get(authenticateJWT(PLATFORM.ADMIN), orderController.findSellerAllOrder);

router
  .route("/admin/seller/order/deleted/list/:id")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    orderController.findAllDeletedSellerOrder
  );

module.exports = router;
