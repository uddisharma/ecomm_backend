const express = require("express");
const router = express.Router();
const orderController = require("../../../controller/client/v1/orderController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router.post(
  "/client/api/v1/order/create",
  authenticateJWT(PLATFORM.CLIENT),
  orderController.addOrder
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

module.exports = router;
