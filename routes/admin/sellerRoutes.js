const express = require("express");
const router = express.Router();
const sellerController = require("../../controller/admin/sellerController");
const authenticateJWT = require("../../middleware/loginUser");
const { PLATFORM } = require("../../constants/authConstant");

router.post(
  "/admin/seller/create",
  authenticateJWT(PLATFORM.ADMIN),
  sellerController.addSeller
);

router.post(
  "/admin/seller/count",
  authenticateJWT(PLATFORM.ADMIN),
  sellerController.getSellerCount
);

router
  .route("/admin/seller/list")
  .get(authenticateJWT(PLATFORM.ADMIN), sellerController.findAllSellers);

router
  .route("/admin/seller/pending/list")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    sellerController.findAllSellersWithPendingOnboarding
  );

router
  .route("/admin/seller/find")
  .get(authenticateJWT(PLATFORM.ADMIN), sellerController?.findSingleSeller);

router
  .route("/admin/seller/find/pending")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    sellerController?.findSingleSellerWithPendingOnboarding
  );

router
  .route("/admin/seller/deleted/list")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    sellerController?.findAllSellersWithDeleted
  );

router
  .route("/admin/seller/find/deleted")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    sellerController?.findSingleSellerWithdeleted
  );

router.get(
  "/admin/seller/categories/:seller",
  authenticateJWT(PLATFORM.ADMIN),
  sellerController.getSellingCategoryofSeller
);

router
  .route("/admin/seller/update/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), sellerController.updateSeller);

router
  .route("/admin/seller/delete/:id")
  .delete(authenticateJWT(PLATFORM.ADMIN), sellerController.deleteSeller1);

router.delete(
  "/admin/seller/delete-category/:sellerId/:categoryId",
  authenticateJWT(PLATFORM.ADMIN),
  sellerController?.deleteCategory
);

router
  .route("/admin/seller/seller/:id")
  .get(authenticateJWT(PLATFORM.ADMIN), sellerController.getSeller);

router
  .route("/admin/add/category")
  .patch(authenticateJWT(PLATFORM.ADMIN), sellerController.addCategory);

router
  .route("/admin/seller/finalonboard/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), sellerController.finalOnboardSeller);

router
  .route("/admin/seller/unonboard/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), sellerController.unOnboardSeller);

module.exports = router;
