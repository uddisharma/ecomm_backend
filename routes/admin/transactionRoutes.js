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

router.route("/admin/transaction/create").post(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  walletTransactionController.addWalletTransaction
);
router.route("/admin/transaction/list").get(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  walletTransactionController.findAllWalletTransaction
);
router
  .route("/admin/transaction/count")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.getWalletTransactionCount
  );
router.route("/admin/transaction/:id").get(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  walletTransactionController.getWalletTransaction
);
router.route("/admin/transaction/update/:id").patch(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  walletTransactionController.updateWalletTransaction
);
router
  .route("/admin/transaction/partial-update/:id")
  .put(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.partialUpdateWalletTransaction
  );
router.route("/admin/transaction/softDelete/:id").patch(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
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
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.bulkUpdateWalletTransaction
  );
router.route("/admin/transaction/delete/:id").delete(
  // auth(PLATFORM.ADMIN),
  // checkRolePermission,
  walletTransactionController.deleteWalletTransaction
);
router
  .route("/admin/transaction/deleteMany")
  .post(
    auth(PLATFORM.ADMIN),
    checkRolePermission,
    walletTransactionController.deleteManyWalletTransaction
  );

module.exports = router;
