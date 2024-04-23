const express = require("express");
const router = express.Router();
const bannerController = require("../../controller/admin/bannerController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router.post(
  "/admin/banner/create",
  authenticateJWT(PLATFORM.ADMIN),
  bannerController.addBanner
);

router
  .route("/admin/banner/list")
  .get(authenticateJWT(PLATFORM.ADMIN), bannerController.findAllBanner);

router
  .route("/admin/sellers/banner/list/:sellerId")
  .get(authenticateJWT(PLATFORM.ADMIN), bannerController.findAllSellersBanner);

router
  .route("/admin/banner/:id")
  .get(authenticateJWT(PLATFORM.ADMIN), bannerController.getBanner);

router
  .route("/admin/banner/update/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), bannerController.updateBanner);

router
  .route("/admin/banner/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), bannerController.softDeleteBanner);

router
  .route("/admin/banner/delete/:id")
  .delete(authenticateJWT(PLATFORM.ADMIN), bannerController.deleteBanner);

module.exports = router;
