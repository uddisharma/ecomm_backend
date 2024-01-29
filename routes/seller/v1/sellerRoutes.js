const express = require("express");
const router = express.Router();
const sellerController = require("../../../controller/seller/v1/sellerController");

router.post("/seller/vi/seller/create", sellerController.addSeller);

router.route("/seller/vi/seller/all").get(sellerController.findAllSellers);

router.get(
  "/seller/vi/seller/categories/:username",
  sellerController.getSellingCategoryofSeller
);

router
  .route("/seller/vi/seller/all/:category")
  .get(sellerController.findAllSellersWithCategory);

router
  .route("/seller/vi/seller/all/search")
  .post(sellerController.findAllSellersForSearch);

router
  .route("/seller/vi/seller/:username")
  .get(sellerController.getSellerDetailsForCheckOut);

router
  .route("/seller/vi/seller/update/:id")
  .patch(sellerController.updateSeller);

router
  .route("/seller/vi/change/password/:id")
  .patch(sellerController.changePassword);

router.get("/seller/v1/seller/:id", sellerController?.getSeller);

router.patch("/seller/v1/add-category", sellerController?.addCategory);

router.delete(
  "/seller/v1/delete-category/:sellerId/:categoryId",
  sellerController?.deleteCategory
);

router
  .route("/seller/:username")
  .get(sellerController.getSellerDetailsForCheckOut);

module.exports = router;
