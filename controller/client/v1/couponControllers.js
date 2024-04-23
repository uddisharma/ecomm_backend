const Coupon = require("../../../model/coupons");
const Seller = require("../../../model/seller");

const applyCoupon = async (req, res) => {
  try {
    const { code, username } = req.body;

    const seller = await Seller.findOne({ username });

    if (!seller) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Seller not found" });
    }
    const coupon = await Coupon.findOne({
      code,
      seller: seller._id,
      isDeleted: false,
    });

    if (!coupon) {
      return res.json({ status: "FAILED", message: "Invalid Coupon" });
    }

    return res.success({ data: coupon });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  applyCoupon,
};
