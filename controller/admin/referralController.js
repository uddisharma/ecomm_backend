const Referral = require("../../model/refferrals");
const Seller = require("../../model/seller");
const User = require("../../model/user");
const dbService = require("../../utils/dbService");

const createReferral = async (req, res) => {
  try {
    const { referringUser, referredSeller, amount, onboarded, status } =
      req.body;
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
      onboarded: onboarded ?? false,
      status: status ?? false,
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
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      sort: "-updatedAt",
      populate: [
        { path: "referringUser", select: "name email mobileNo" },
        { path: "referredSeller", select: "shopname username" },
      ],
    };
    let query = {
      isDeleted: req.query.isDeleted,
    };
    let referrals = await dbService.paginate(Referral, query, options);

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
    const referral = await Referral.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("referringUser referredSeller");
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
