const express = require("express");
const router = express.Router();
const ReferralController = require("../../controller/admin/referralController");

router.post("/admin/referrals", ReferralController.createReferral);
router.get("/admin/referrals", ReferralController.getAllReferrals);
router.get("/admin/referral/:id", ReferralController.getReferralById);
router.patch("/admin/referrals/:id", ReferralController.updateReferral);
router.delete("/admin/referrals/:id", ReferralController.deleteReferral);
router.get(
  "/admin/referral/user/:id",
  ReferralController.getAllReferralsofUser
);
module.exports = router;
