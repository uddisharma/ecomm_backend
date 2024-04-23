const express = require("express");
const router = express.Router();
const couponController = require("../../controller/admin/couponController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router.post(
  "/admin/coupon/add",
  authenticateJWT(PLATFORM.ADMIN),
  couponController.addCoupon
);

router.get(
  "/admin/seller/coupon/list/:seller",
  authenticateJWT(PLATFORM.ADMIN),
  couponController.findSellersCoupons
);

router.get(
  "/admin/coupon/:id",
  authenticateJWT(PLATFORM.ADMIN),
  couponController.getCoupon
);

router.patch(
  "/admin/coupon/update/:id",
  authenticateJWT(PLATFORM.ADMIN),
  couponController.updateCoupon
);

router.delete(
  "/admin/coupon/delete/:id",
  authenticateJWT(PLATFORM.ADMIN),
  couponController.deleteCoupon
);

module.exports = router;
