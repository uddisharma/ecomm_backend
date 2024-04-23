const Banner = require("../../../model/banner");
const dbService = require("../../../utils/dbService");
const Seller = require("../../../model/seller");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const findSellerAllBanner = async (req, res) => {
  try {
    let options = {
      sort: { createdAt: -1 },
      populate: {
        path: "sellerId",
        select: ["isActive", "isDeleted", "isOnboarded"],
      },
    };
    let query = { isDeleted: false };

    if (req.params.username) {
      const seller = await Seller.findOne({ username: req.params.username });

      if (!seller) {
        return res.json({
          status: "SELLERNOTFOUND",
        });
      }

      query.sellerId = seller._id;
    }

    // const chachedbanners = myCache.get("sellerbannersclient");

    // if (chachedbanners) {
    //   return res.success({ data: JSON.parse(chachedbanners) });
    // } else {
      let foundBanners = await dbService.paginate(Banner, query, options);

      if (!foundBanners || !foundBanners.data || !foundBanners.data.length) {
        return res.recordNotFound();
      }

      // myCache.set("sellerbannersclient", JSON.stringify(foundBanners), 21600);
      return res.success({ data: foundBanners });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  findSellerAllBanner,
};
