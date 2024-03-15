const express = require("express");
const router = express.Router();
const ReferralController = require("../../../controller/client/v1/referralController");

router.post("/referrals", ReferralController.createReferral);
router.get("/referrals", ReferralController.getAllReferrals);
router.get("/referral/:id", ReferralController.getReferralById);
router.patch("/referrals/:id", ReferralController.updateReferral);
router.delete("/referrals/:id", ReferralController.deleteReferral);
router.get("/referral/user/:id", ReferralController.getAllReferralsofUser);
module.exports = router;
