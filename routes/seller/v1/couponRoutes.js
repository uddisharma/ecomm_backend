const express = require("express");
const router = express.Router();
const couponController = require("../../../controller/seller/v1/couponController");

router.post("/seller/coupon/add", couponController.addCoupon);

router.post("/seller/coupon/apply", couponController.applyCoupon);

router.get("/seller/coupon/list", couponController.findAllCoupons);

router.get("/seller/coupon/count", couponController.getCouponCount);

router.get(
  "/seller/coupon/all/list/:seller",
  couponController.findSellersCoupons
);

router.get("/seller/coupon/code/:id", couponController.getCoupon);

router.patch("/seller/coupon/update/:id", couponController.updateCoupon);

router.delete("/seller/coupon/delete/:id", couponController.deleteCoupon);

module.exports = router;
