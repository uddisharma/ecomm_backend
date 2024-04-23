const express = require("express");
const router = express.Router();
const authController = require("../../controller/admin/authController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.route("/register").post(limiter, authController.register);
router.post("/login", limiter, authController.login);
router.route("/forgot-password").post(limiter, authController.forgotPassword);
router.route("/reset-password").put(limiter, authController.resetPassword);
router
  .route("/update")
  .patch(authenticateJWT(PLATFORM.ADMIN), limiter, authController.updateAdmin);
router
  .route("/change/password")
  .patch(
    authenticateJWT(PLATFORM.ADMIN),
    limiter,
    authController.changePassword
  );
module.exports = router;
