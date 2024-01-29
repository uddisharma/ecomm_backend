const express = require("express");
const router = express.Router();
const couponController = require("../../controller/admin/couponController");

router.post("/admin/coupon/add", couponController.addCoupon);

router.post("/admin/coupon/apply", couponController.applyCoupon);

router.get("/admin/coupon/list", couponController.findAllCoupons);

router.get("/admin/coupon/count", couponController.getCouponCount);

router.get(
  "/admin/seller/coupon/list/:seller",
  couponController.findSellersCoupons
);

router.get("/admin/coupon/:id", couponController.getCoupon);

router.patch("/admin/coupon/update/:id", couponController.updateCoupon);

router.delete("/admin/coupon/delete/:id", couponController.deleteCoupon);

module.exports = router;
