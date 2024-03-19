const express = require("express");
const router = express.Router();
const couponController = require("../../../controller/seller/v1/couponController");
const authenticateJWT = require("../../../middleware/loginUser");
const { PLATFORM } = require("../../../constants/authConstant");

router.post(
  "/seller/coupon/add",
  authenticateJWT(PLATFORM.DEVICE),
  couponController.addCoupon
);

router.post("/seller/coupon/apply", couponController.applyCoupon);

router.get(
  "/seller/coupon/list",
  authenticateJWT(PLATFORM.DEVICE),
  couponController.findAllCoupons
);

router.get("/seller/coupon/count", couponController.getCouponCount);

router.get(
  "/seller/coupon/all/list",
  authenticateJWT(PLATFORM.DEVICE),
  couponController.findSellersCoupons
);

router.get(
  "/seller/coupon/code/:id",
  authenticateJWT(PLATFORM.DEVICE),
  couponController.getCoupon
);

router.patch(
  "/seller/coupon/update/:id",
  authenticateJWT(PLATFORM.DEVICE),
  couponController.updateCoupon
);

router.delete(
  "/seller/coupon/delete/:id",
  authenticateJWT(PLATFORM.DEVICE),
  couponController.deleteCoupon
);

module.exports = router;
