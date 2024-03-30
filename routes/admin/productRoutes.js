/**
 * productRoutes.js
 * @description :: CRUD API routes for product
 */

const express = require("express");
const router = express.Router();
const productController = require("../../controller/admin/productController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");
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
  .route("/admin/sellers/product/list/:id")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    productController.findSellersAllProduct
  );

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
router.get(
  "/admin/product/:id",
  authenticateJWT(PLATFORM.ADMIN),
  productController.getProduct
);

router
  .route("/admin/product/update/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), productController.updateProduct);
router
  .route("/admin/product/partial-update/:id")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.partialUpdateProduct
  );
router
  .route("/admin/product/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), productController.softDeleteProduct);
router
  .route("/admin/product/softDeleteMany")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.softDeleteManyProduct
  );
router
  .route("/admin/product/addBulk")
  .post(productController.bulkInsertProduct);
router
  .route("/admin/product/updateBulk")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.bulkUpdateProduct
  );
router
  .route("/admin/product/delete/:id")
  .delete(authenticateJWT(PLATFORM.ADMIN), productController.deleteProduct);
router
  .route("/admin/product/deleteMany")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    productController.deleteManyProduct
  );

module.exports = router;
