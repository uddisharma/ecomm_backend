/**
 * productRoutes.js
 * @description :: CRUD API routes for product
 */

const express = require("express");
const router = express.Router();
const productController = require("../../../controller/seller/v1/productController");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const checkRolePermission = require("../../../middleware/checkRolePermission");
const authenticateJWT = require("../../../middleware/loginUser");

router
  .route("/seller/api/v1/product/create")
  .post(authenticateJWT(PLATFORM.DEVICE), productController.addProduct);
router
  .route("/seller/api/v1/product/list")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    productController.findAllProduct
  );

router.get(
  "/seller/api/v1/seller/product/list/:id",
  authenticateJWT(PLATFORM.DEVICE),
  productController.findSellersAllProduct
);

router
  .route("/seller/api/v1/product/count")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    productController.getProductCount
  );
router.route("/seller/api/v1/product/:id").get(
  authenticateJWT(PLATFORM.DEVICE),

  productController.getProduct
);
router
  .route("/seller/api/v1/product/update/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), productController.updateProduct);
router
  .route("/seller/api/v1/product/partial-update/:id")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    productController.partialUpdateProduct
  );
router
  .route("/seller/api/v1/product/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), productController.softDeleteProduct);
router
  .route("/seller/api/v1/product/softDeleteMany")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    productController.softDeleteManyProduct
  );
router
  .route("/seller/api/v1/product/addBulk")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    productController.bulkInsertProduct
  );
router
  .route("/seller/api/v1/product/updateBulk")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    productController.bulkUpdateProduct
  );
router
  .route("/seller/api/v1/product/delete/:id")
  .delete(authenticateJWT(PLATFORM.DEVICE), productController.deleteProduct);
  
router
  .route("/seller/api/v1/product/deleteMany")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    productController.deleteManyProduct
  );

// router.get("/seller/product/:id/", productController.getProductById);

router
  .route("/seller/product/list")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    productController.findSellersAllProduct
  );

module.exports = router;
