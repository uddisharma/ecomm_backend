const Referral = require("../../../model/refferrals");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const getAllReferralsofUser = async (req, res) => {
  try {
    const id = req.user.id;
    // const chachedreferrals = myCache.get("userreferralsclient");

    // if (chachedreferrals) {
    //   return res.success({ data: JSON.parse(chachedreferrals) });
    // } else {
    const referrals = await Referral.find({
      referringUser: id,
      isDeleted: false,
    })
      .populate({
        path: "referredSeller",
        select: ["shopname", "username"],
      })
      .sort("-updatedAt");
    if (!referrals) {
      return res.recordNotFound();
    }

    // myCache.set("userreferralsclient", JSON.stringify(referrals), 500);
    return res.success({ data: referrals });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  getAllReferralsofUser,
};
