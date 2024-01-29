const Referral = require("../../../model/refferrals");
const Seller = require("../../../model/seller");
const User = require("../../../model/user");

// Create a new referral
const createReferral = async (req, res) => {
  try {
    const { referringUserId, referredUserId } = req.body;

    // Check if both users exist
    const referringUser = await User.findById(referringUserId);
    const referredUser = await User.findById(referredUserId);

    if (!referringUser || !referredUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new referral
    const referral = new Referral({ referringUser, referredUser });
    await referral.save();

    res.status(201).json(referral);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all referrals
const getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().populate(
      "referringUser referredSeller"
    );
    res.json(referrals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id).populate(
      "referringUser referredSeller"
    );
    if (!referral) {
      return res.status(404).json({ error: "Referral not found" });
    }
    res.json(referral);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a referral by ID
const updateReferral = async (req, res) => {
  try {
    const { referringUserId, referredSellerId } = req.body;
    
    const referringUser = await User.findById(referringUserId);
    const referredSeller = await Seller.findById(referredSellerId);

    if (!referringUser || !referredUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { referringUser, referredSeller },
      { new: true, runValidators: true }
    ).populate("referringUser referredSeller");

    if (!referral) {
      return res.status(404).json({ error: "Referral not found" });
    }

    res.json(referral);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a referral by ID
const deleteReferral = async (req, res) => {
  try {
    const referral = await Referral.findByIdAndDelete(req.params.id);
    if (!referral) {
      return res.status(404).json({ error: "Referral not found" });
    }
    res.json({ message: "Referral deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Export the router
module.exports = {
  createReferral,
  getAllReferrals,
  getReferralById,
  updateReferral,
  deleteReferral,
};
