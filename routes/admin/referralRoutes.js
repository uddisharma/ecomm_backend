const express = require("express");
const router = express.Router();
const ReferralController = require("../../controller/admin/referralController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router.post(
  "/admin/referrals",
  authenticateJWT(PLATFORM.ADMIN),
  ReferralController.createReferral
);
router.get(
  "/admin/referrals",
  authenticateJWT(PLATFORM.ADMIN),
  ReferralController.getAllReferrals
);
router.get(
  "/admin/referral/:id",
  authenticateJWT(PLATFORM.ADMIN),
  ReferralController.getReferralById
);
router.patch(
  "/admin/referrals/:id",
  authenticateJWT(PLATFORM.ADMIN),
  ReferralController.updateReferral
);
router.delete(
  "/admin/referrals/:id",
  authenticateJWT(PLATFORM.ADMIN),
  ReferralController.deleteReferral
);
router.get(
  "/admin/referral/user/:id",
  authenticateJWT(PLATFORM.ADMIN),
  ReferralController.getAllReferralsofUser
);
module.exports = router;
