const express = require("express");
const router = express.Router();
const sellerController = require("../../controller/admin/sellerController");
router.post("/admin/seller/create", sellerController.addSeller);

router.route("/admin/seller/list").get(sellerController.findAllSellers);

router
  .route("/admin/seller/pending/list")
  .get(sellerController.findAllSellersWithPendingOnboarding);

router.route("/admin/seller/find").get(sellerController?.findSingleSeller);

router
  .route("/admin/seller/find/pending")
  .get(sellerController?.findSingleSellerWithPendingOnboarding);

router
  .route("/admin/seller/deleted/list")
  .get(sellerController?.findAllSellersWithDeleted);

router
  .route("/admin/seller/find/deleted")
  .get(sellerController?.findSingleSellerWithdeleted);

router.get(
  "/admin/seller/categories/:seller",
  sellerController.getSellingCategoryofSeller
);

router
  .route("/admin/seller/all/:category")
  .get(sellerController.findAllSellersWithCategory);

router
  .route("/admin/seller/all/search")
  .post(sellerController.findAllSellersForSearch);

router
  .route("/admin/seller/:username")
  .get(sellerController.getSellerDetailsForCheckOut);

router.route("/admin/seller/update/:id").patch(sellerController.updateSeller);

router
  .route("/admin/seller/all/update")
  .patch(sellerController.updateAllSellers);

router.delete(
  "/admin/seller/delete-category/:sellerId/:categoryId",
  sellerController?.deleteCategory
);

router.route("/admin/seller/seller/:id").get(sellerController.getSeller);

module.exports = router;
