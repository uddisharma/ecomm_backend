const express = require("express");
const router = express.Router();
const walletTransactionController = require("../../../controller/seller/v1/transactionController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");


router
  .route("/seller/api/v1/transaction/:id")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    walletTransactionController.getWalletTransaction
  );

router
  .route("/seller/api/v1/wallettransactions")
  .get(
    authenticateJWT(PLATFORM.DEVICE),
    walletTransactionController.findSellersTransaction
  );

module.exports = router;
