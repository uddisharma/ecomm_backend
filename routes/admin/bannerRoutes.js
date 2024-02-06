/**
 * bannerRoutes.js
 * @description :: CRUD API routes for banner
 */

const express = require("express");
const router = express.Router();
const bannerController = require("../../controller/admin/bannerController");
const { PLATFORM } = require("../../constants/authConstant");
const auth = require("../../middleware/auth");
const checkRolePermission = require("../../middleware/checkRolePermission");

router.post("/admin/banner/create", bannerController.addBanner);
// .post(auth(PLATFORM.ADMIN), checkRolePermission, bannerController.addBanner);
router
  .route("/admin/banner/list")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    bannerController.findAllBanner
  );
router
  .route("/admin/seller/banner/list/:username")
  .get(bannerController.findSellerAllBanner);

router
  .route("/admin/sellers/banner/list/:sellerId")
  .get(bannerController.findAllSellersBanner);

router
  .route("/admin/banner/count")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    bannerController.getBannerCount
  );
router.route("/admin/banner/:id").get(bannerController.getBanner);
router.route("/admin/banner/update/:id").patch(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  bannerController.updateBanner
);
router
  .route("/admin/banner/partial-update/:id")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    bannerController.partialUpdateBanner
  );
router
  .route("/admin/banner/softDelete/:id")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    bannerController.softDeleteBanner
  );
router
  .route("/admin/banner/softDeleteMany")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    bannerController.softDeleteManyBanner
  );
router
  .route("/admin/banner/addBulk")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    bannerController.bulkInsertBanner
  );
router
  .route("/admin/banner/updateBulk")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    bannerController.bulkUpdateBanner
  );
router.route("/admin/banner/delete/:id").delete(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  bannerController.deleteBanner
);
router
  .route("/admin/banner/deleteMany")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    bannerController.deleteManyBanner
  );

module.exports = router;
