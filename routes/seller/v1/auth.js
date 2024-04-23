const express = require("express");
const router = express.Router();
const authController = require("../../../controller/seller/v1/authController");
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

module.exports = router;
