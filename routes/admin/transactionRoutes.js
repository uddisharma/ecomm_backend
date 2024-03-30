/**
 * walletTransactionRoutes.js
 * @description :: CRUD API routes for walletTransaction
 */

const express = require("express");
const router = express.Router();
const walletTransactionController = require("../../controller/admin/transactionController");
const { PLATFORM } = require("../../constants/authConstant");
const auth = require("../../middleware/auth");
const checkRolePermission = require("../../middleware/checkRolePermission");
const authenticateJWT = require("../../middleware/loginUser");

router
  .route("/admin/transaction/create")
  .post(
    authenticateJWT(PLATFORM.ADMIN),
    walletTransactionController.addWalletTransaction
  );
router
  .route("/admin/transaction/list")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    walletTransactionController.findAllWalletTransaction
  );
router
  .route("/admin/transaction/count")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.getWalletTransactionCount
  );
router
  .route("/admin/transaction/:id")
  .get(
    authenticateJWT(PLATFORM.ADMIN),
    walletTransactionController.getWalletTransaction
  );
router
  .route("/admin/transaction/update/:id")
  .patch(
    authenticateJWT(PLATFORM.ADMIN),
    walletTransactionController.updateWalletTransaction
  );
router
  .route("/admin/transaction/partial-update/:id")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.partialUpdateWalletTransaction
  );
router
  .route("/admin/transaction/softDelete/:id")
  .patch(
    authenticateJWT(PLATFORM.ADMIN),
    walletTransactionController.softDeleteWalletTransaction
  );
router
  .route("/admin/transaction/softDeleteMany")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.softDeleteManyWalletTransaction
  );
router
  .route("/admin/transaction/addBulk")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.bulkInsertWalletTransaction
  );
router
  .route("/admin/transaction/updateBulk")
  .put(
    authenticateJWT(PLATFORM.ADMIN),
    walletTransactionController.bulkUpdateWalletTransaction
  );
router
  .route("/admin/transaction/delete/:id")
  .delete(
    authenticateJWT(PLATFORM.ADMIN),
    walletTransactionController.deleteWalletTransaction
  );
router
  .route("/admin/transaction/deleteMany")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.deleteManyWalletTransaction
  );

router
  .route("/admin/seller/wallettransactions/:id")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    walletTransactionController.findSellersTransaction
  );

module.exports = router;
