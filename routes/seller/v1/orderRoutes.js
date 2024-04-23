const express = require("express");
const router = express.Router();
const orderController = require("../../../controller/seller/v1/orderController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router
  .route("/seller/api/v1/order/list/")
  .get(authenticateJWT(PLATFORM.DEVICE), orderController.findAllOrder);

router
  .route("/seller/api/v1/order/count")
  .post(authenticateJWT(PLATFORM.DEVICE), orderController.getOrderCount);

router
  .route("/seller/api/v1/order/:id")
  .get(authenticateJWT(PLATFORM.DEVICE), orderController.getOrder);

router
  .route("/seller/api/v1/order/revenue/monthwise")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    orderController.getYearlySellerRevenue
  );

router
  .route("/seller/api/v1/order/update/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), orderController.updateOrder);

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
  .get(authenticateJWT(PLATFORM.DEVICE), orderController.sevenDaysOrder);

module.exports = router;
