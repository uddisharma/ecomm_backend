const express = require("express");
const router = express.Router();
const walletTransactionController = require("../../controller/admin/transactionController");
const { PLATFORM } = require("../../constants/authConstant");
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
    authenticateJWT(PLATFORM.ADMIN),
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
  .route("/admin/transaction/softDelete/:id")
  .patch(
    authenticateJWT(PLATFORM.ADMIN),
    walletTransactionController.softDeleteWalletTransaction
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
  .route("/admin/seller/wallettransactions/:id")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    walletTransactionController.findSellersTransaction
  );

module.exports = router;
