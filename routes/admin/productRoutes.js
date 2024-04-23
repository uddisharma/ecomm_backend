const express = require("express");
const router = express.Router();
const productController = require("../../controller/admin/productController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router.post(
  "/admin/product/create",
  authenticateJWT(PLATFORM.ADMIN),
  productController.addProduct
);

router
  .route("/admin/sellers/product/list/:id")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    productController.findSellersAllProduct
  );

router
  .route("/admin/product/count")
  .post(authenticateJWT(PLATFORM.ADMIN), productController.getProductCount);

router.get(
  "/admin/product/:id",
  authenticateJWT(PLATFORM.ADMIN),
  productController.getProduct
);

router
  .route("/admin/product/update/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), productController.updateProduct);

router
  .route("/admin/product/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), productController.softDeleteProduct);

router
  .route("/admin/product/delete/:id")
  .delete(authenticateJWT(PLATFORM.ADMIN), productController.deleteProduct);

module.exports = router;
