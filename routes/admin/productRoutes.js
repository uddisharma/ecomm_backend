/**
 * productRoutes.js
 * @description :: CRUD API routes for product
 */

const express = require("express");
const router = express.Router();
const productController = require("../../controller/admin/productController");
const { PLATFORM } = require("../../constants/authConstant");
const auth = require("../../middleware/auth");
const checkRolePermission = require("../../middleware/checkRolePermission");

router.post("/admin/product/create", productController.addProduct);

router.route("/admin/product/list").get(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  productController.findAllProduct
);

router.get("/admin/p/:id/:seller", productController.getProductById);

router
  .route("/admin/sellers/product/list/:username")
  .get(productController.findSellersAllProduct);

router
  .route("/admin/sellers/related/product/list/:username")
  .get(productController.findSellersRelatedProducts);

router
  .route("/admin/sellers/product/search/list/:username")
  .get(productController.findSellersAllProductForSearch);

router
  .route("/admin/product/count")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.getProductCount
  );
router.get("/admin/product/:id", productController.getProduct);

router.route("/admin/product/update/:id").put(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  productController.updateProduct
);
router
  .route("/admin/product/partial-update/:id")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.partialUpdateProduct
  );
router
  .route("/admin/product/softDelete/:id")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.softDeleteProduct
  );
router
  .route("/admin/product/softDeleteMany")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.softDeleteManyProduct
  );
router
  .route("/admin/product/addBulk")
  .post(
    // auth(PLATFORM.ADMIN),
    // checkRolePermission,
    productController.bulkInsertProduct
  );
router
  .route("/admin/product/updateBulk")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.bulkUpdateProduct
  );
router
  .route("/admin/product/delete/:id")
  .delete(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.deleteProduct
  );
router
  .route("/admin/product/deleteMany")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.deleteManyProduct
  );

module.exports = router;
