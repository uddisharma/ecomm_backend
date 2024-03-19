const express = require("express");
const router = express.Router();
const sellerController = require("../../../controller/seller/v1/sellerController");
const authenticateJWT = require("../../../middleware/loginUser");
const { PLATFORM } = require("../../../constants/authConstant");

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
  .route("/seller/vi/seller/update")
  .patch(authenticateJWT(PLATFORM.DEVICE), sellerController.updateSeller);

router
  .route("/seller/vi/change/password")
  .patch(authenticateJWT(PLATFORM.DEVICE), sellerController.changePassword);

router.get("/seller/v1/seller/:id", sellerController?.getSeller);

router.patch(
  "/seller/v1/add-category",
  authenticateJWT(PLATFORM.DEVICE),
  sellerController?.addCategory
);

router.delete(
  "/seller/v1/delete-category/:categoryId",
  authenticateJWT(PLATFORM.DEVICE),
  sellerController?.deleteCategory
);

router
  .route("/seller/:username")
  .get(sellerController.getSellerDetailsForCheckOut);

module.exports = router;
