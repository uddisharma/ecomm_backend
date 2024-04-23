const express = require("express");
const router = express.Router();
const productController = require("../../../controller/seller/v1/productController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router
  .route("/seller/api/v1/product/create")
  .post(authenticateJWT(PLATFORM.DEVICE), productController.addProduct);

router.get(
  "/seller/api/v1/seller/product/list/:id",
  authenticateJWT(PLATFORM.DEVICE),
  productController.findSellersAllProduct
);

router
  .route("/seller/api/v1/product/count")
  .post(authenticateJWT(PLATFORM.DEVICE), productController.getProductCount);

router
  .route("/seller/api/v1/product/:id")
  .get(authenticateJWT(PLATFORM.DEVICE), productController.getProduct);
router
  .route("/seller/api/v1/product/update/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), productController.updateProduct);

router
  .route("/seller/api/v1/product/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), productController.softDeleteProduct);

router
  .route("/seller/api/v1/product/addBulk")
  .post(authenticateJWT(PLATFORM.DEVICE), productController.bulkInsertProduct);

router
  .route("/seller/api/v1/product/delete/:id")
  .delete(authenticateJWT(PLATFORM.DEVICE), productController.deleteProduct);

router
  .route("/seller/product/list")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    productController.findSellersAllProduct
  );

module.exports = router;
