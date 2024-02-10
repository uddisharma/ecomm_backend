/**
 * walletTransactionRoutes.js
 * @description :: CRUD API routes for walletTransaction
 */

const express = require("express");
const router = express.Router();
const walletTransactionController = require("../../../controller/seller/v1/walletTransactionController");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const checkRolePermission = require("../../../middleware/checkRolePermission");

router
  .route("/seller/api/v1/wallettransaction/create")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.addWalletTransaction
  );
router
  .route("/seller/api/v1/wallettransaction/list")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.findAllWalletTransaction
  );
router
  .route("/seller/api/v1/wallettransaction/count")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.getWalletTransactionCount
  );
router
  .route("/seller/api/v1/wallettransaction/:id")
  .get(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.getWalletTransaction
  );
router
  .route("/seller/api/v1/wallettransaction/update/:id")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.updateWalletTransaction
  );
router
  .route("/seller/api/v1/wallettransaction/partial-update/:id")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.partialUpdateWalletTransaction
  );
router.route("/seller/api/v1/wallettransaction/softDelete/:id").patch(
  // auth(PLATFORM.DEVICE),
  // checkRolePermission,
  walletTransactionController.softDeleteWalletTransaction
);
router
  .route("/seller/api/v1/wallettransaction/softDeleteMany")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.softDeleteManyWalletTransaction
  );
router
  .route("/seller/api/v1/wallettransaction/addBulk")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.bulkInsertWalletTransaction
  );
router
  .route("/seller/api/v1/wallettransaction/updateBulk")
  .put(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.bulkUpdateWalletTransaction
  );
router
  .route("/seller/api/v1/wallettransaction/delete/:id")
  .delete(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.deleteWalletTransaction
  );
router
  .route("/seller/api/v1/wallettransaction/deleteMany")
  .post(
    auth(PLATFORM.DEVICE),
    checkRolePermission,
    walletTransactionController.deleteManyWalletTransaction
  );

router
  .route("/seller/api/v1/wallettransactions/:seller")
  .get(walletTransactionController.findSellersTransaction);

module.exports = router;
