const Referral = require("../../../model/refferrals");
const Seller = require("../../../model/seller");
const User = require("../../../model/user");

// Create a new referral
const createReferral = async (req, res) => {
  try {
    const { referringUser, referredSeller, amount } = req.body;

    const referringUser1 = await User.findById(referringUser);
    const referredUser = await Seller.findById(referredSeller);

    if (!referringUser || !referredUser) {
      return res.recordNotFound();
    }

    const foundReferral = await Referral.findOne({
      referringUser: referringUser1?._id,
      referredSeller: referredUser?._id,
    });

    if (foundReferral) {
      return res.json({ data: { status: "EXIST" } });
    }

    const referral = new Referral({
      referringUser: referringUser1?._id,
      referredSeller: referredUser?._id,
      amount,
    });
    await referral.save();
    return res.success({ data: referral });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

// Get all referrals
const getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().populate(
      "referringUser referredSeller"
    );
    if (!referrals) {
      return res.recordNotFound();
    }
    return res.success({ data: referrals });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getAllReferralsofUser = async (req, res) => {
  try {
    const id = req.params.id;
    const referrals = await Referral.find({ referringUser: id }).populate({
      path: "referredSeller",
      select: ["shopname", "username"],
    });
    if (!referrals) {
      return res.recordNotFound();
    }
    return res.success({ data: referrals });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id).populate(
      "referringUser referredSeller"
    );
    if (!referral) {
      return res.recordNotFound();
    }
    return res.success({ data: referral });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

// Update a referral by ID
const updateReferral = async (req, res) => {
  try {
    const { status } = req.body;
    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("referringUser referredSeller");
    if (!referral) {
      return res.recordNotFound();
    }
    return res.success({ data: referral });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

// Delete a referral by ID
const deleteReferral = async (req, res) => {
  try {
    const referral = await Referral.findByIdAndDelete(req.params.id);
    if (!referral) {
      return res.recordNotFound();
    }
    return res.success({ data: referral });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

// Export the router
module.exports = {
  createReferral,
  getAllReferrals,
  getReferralById,
  updateReferral,
  deleteReferral,
  getAllReferralsofUser,
};
