const express = require("express");
const router = express.Router();
const sellerController = require("../../../controller/client/v1/sellerController");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const checkRolePermission = require("../../../middleware/checkRolePermission");

router.post("/client/seller/create", sellerController.addSeller);

router.route("/client/seller/all").get(sellerController.findAllSellers);

router.get(
  "/client/seller/categories/:username",
  sellerController.getSellingCategoryofSeller
);
router
  .route("/client/seller/all/:category")
  .get(sellerController.findAllSellersWithCategory);

router
  .route("/client/seller/all/search")
  .post(sellerController.findAllSellersForSearch);

router
  .route("/client/seller/:username")
  .get(sellerController.getSellerDetailsForCheckOut);

router.route("/client/seller/update/:id").patch(sellerController.updateSeller);

module.exports = router;
