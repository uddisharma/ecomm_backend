/**
 * bannerRoutes.js
 * @description :: CRUD API routes for banner
 */

const express = require("express");
const router = express.Router();
const bannerController = require("../../../controller/seller/v1/bannerController");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const authenticateJWT = require("../../../middleware/loginUser");
const checkRolePermission = require("../../../middleware/checkRolePermission");

router
  .route("/seller/api/v1/banner/create")
  .post(authenticateJWT(PLATFORM.DEVICE), bannerController.addBanner);
router
  .route("/seller/api/v1/banner/list")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    bannerController.findAllBanner
  );
router
  .route("/seller/api/v1/banner/count")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    bannerController.getBannerCount
  );
router
  .route("/seller/api/v1/banner/:id")
  .get(auth(PLATFORM.DEVICE), checkRolePermission, bannerController.getBanner);
router
  .route("/seller/api/v1/banner/update/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), bannerController.updateBanner);
router
  .route("/seller/api/v1/banner/partial-update/:id")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    bannerController.partialUpdateBanner
  );
router
  .route("/seller/api/v1/banner/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), bannerController.softDeleteBanner);
router
  .route("/seller/api/v1/banner/softDeleteMany")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    bannerController.softDeleteManyBanner
  );
router
  .route("/seller/api/v1/banner/addBulk")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    bannerController.bulkInsertBanner
  );
router
  .route("/seller/api/v1/banner/updateBulk")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    bannerController.bulkUpdateBanner
  );
router
  .route("/seller/api/v1/banner/delete/:id")
  .delete(authenticateJWT(PLATFORM.DEVICE), bannerController.deleteBanner);
router
  .route("/seller/api/v1/banner/deleteMany")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    bannerController.deleteManyBanner
  );

router
  .route("/sellers/sellers/banner/list")
  .get(authenticateJWT(PLATFORM.DEVICE), bannerController.findAllSellersBanner);

module.exports = router;
