const express = require("express");
const router = express.Router();
const bannerController = require("../../../controller/seller/v1/bannerController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router
  .route("/seller/api/v1/banner/create")
  .post(authenticateJWT(PLATFORM.DEVICE), bannerController.addBanner);

router
  .route("/seller/api/v1/banner/update/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), bannerController.updateBanner);

router
  .route("/seller/api/v1/banner/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), bannerController.softDeleteBanner);

router
  .route("/seller/api/v1/banner/delete/:id")
  .delete(authenticateJWT(PLATFORM.DEVICE), bannerController.deleteBanner);

router
  .route("/sellers/sellers/banner/list")
  .get(authenticateJWT(PLATFORM.DEVICE), bannerController.findAllSellersBanner);

module.exports = router;
