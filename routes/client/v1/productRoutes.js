const express = require("express");
const router = express.Router();
const productController = require("../../../controller/client/v1/productController");

router.get("/client/p/:id/:seller", productController.getProductById);

router
  .route("/client/sellers/product/list/:username")
  .get(productController.findSellersAllProduct);

router
  .route("/client/sellers/product/list/search/:username")
  .get(productController.searchSellerProducts);

module.exports = router;
