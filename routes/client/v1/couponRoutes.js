const express = require("express");
const router = express.Router();
const couponController = require("../../../controller/client/v1/couponControllers");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router.post(
  "/client/coupon/apply",
  authenticateJWT(PLATFORM.CLIENT),
  couponController.applyCoupon
);

module.exports = router;
