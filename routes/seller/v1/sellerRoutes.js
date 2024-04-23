const express = require("express");
const router = express.Router();
const sellerController = require("../../../controller/seller/v1/sellerController");
const authenticateJWT = require("../../../middleware/loginUser");
const { PLATFORM } = require("../../../constants/authConstant");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.post("/seller/vi/seller/create", limiter, sellerController.addSeller);

router
  .route("/seller/vi/seller/update")
  .patch(
    authenticateJWT(PLATFORM.DEVICE),
    limiter,
    sellerController.updateSeller
  );

router
  .route("/seller/vi/change/password")
  .patch(authenticateJWT(PLATFORM.DEVICE), sellerController.changePassword);

router.patch(
  "/seller/v1/add-category",
  authenticateJWT(PLATFORM.DEVICE),
  sellerController?.addCategory
);

router.delete(
  "/seller/v1/delete-category/:categoryId",
  authenticateJWT(PLATFORM.DEVICE),
  sellerController?.deleteCategory
);

router.post("/seller/v1/login", limiter, sellerController.login);

module.exports = router;
