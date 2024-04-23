const express = require("express");
const router = express.Router();
const sellerController = require("../../../controller/client/v1/sellerController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router.get(
  "/client/seller/categories/:username",
  sellerController.getSellingCategoryofSeller
);

router.route("/client/seller/all").get(sellerController.findAllSellers);

router
  .route("/client/seller/all/:category")
  .get(sellerController.findAllSellersWithCategory);

router
  .route("/client/seller/:username")
  .get(
    authenticateJWT(PLATFORM.CLIENT),
    sellerController.getSellerDetailsForCheckOut
  );

router.route("/client/seller/search/all").get(sellerController.searchSeller);

module.exports = router;
