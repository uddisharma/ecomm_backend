/**
 * orderRoutes.js
 * @description :: CRUD API routes for order
 */

const express = require("express");
const router = express.Router();
const orderController = require("../../../controller/client/v1/orderController");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const checkRolePermission = require("../../../middleware/checkRolePermission");
const authenticateJWT = require("../../../middleware/loginUser");

router.post("/client/api/v1/order/create", orderController.addOrder);
// .post(auth(PLATFORM.CLIENT), checkRolePermission, orderController.addOrder);
router.post("/client/api/v1/order/list", orderController.findAllOrder);
// .post(
//   auth(PLATFORM.CLIENT),
//   checkRolePermission,
//   orderController.findAllOrder
// );
router
  .route("/client/api/v1/order/count")
  .post(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.getOrderCount
  );
router
  .route("/client/api/v1/order/count/today")
  .post(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.getOrderCountForCurrentDate
  );
router
  .route("/client/api/v1/order/sales/today")
  .post(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.getTotalSalesForCurrentDate
  );
router.route("/client/api/v1/order/revenue/monthwise").get(
  // auth(PLATFORM.CLIENT),
  // checkRolePermission,
  orderController.getMonthWiseRevenue
);

router.get(
  "/client/api/v1/order/:id",
  authenticateJWT(PLATFORM.CLIENT),
  orderController.getOrder
);

router.get(
  "/client/api/v1/orders/user",
  authenticateJWT(PLATFORM.CLIENT),
  orderController.getAllOrdersByUser
);

// .get(auth(PLATFORM.CLIENT), checkRolePermission, orderController.getOrder);
router
  .route("/client/api/v1/order/update/:id")
  .put(auth(PLATFORM.CLIENT), checkRolePermission, orderController.updateOrder);
router
  .route("/client/api/v1/order/partial-update/:id")
  .put(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.partialUpdateOrder
  );
router
  .route("/client/api/v1/order/softDelete/:id")
  .put(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.softDeleteOrder
  );
router
  .route("/client/api/v1/order/softDeleteMany")
  .put(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.softDeleteManyOrder
  );
router
  .route("/client/api/v1/order/addBulk")
  .post(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.bulkInsertOrder
  );
router
  .route("/client/api/v1/order/updateBulk")
  .put(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.bulkUpdateOrder
  );
router
  .route("/client/api/v1/order/delete/:id")
  .delete(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.deleteOrder
  );
router
  .route("/client/api/v1/order/deleteMany")
  .post(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    orderController.deleteManyOrder
  );

module.exports = router;
