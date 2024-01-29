const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  referringUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  referredSeller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;
