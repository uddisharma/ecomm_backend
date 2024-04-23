const Product = require("../../../model/product");
const dbService = require("../../../utils/dbService");
const Seller = require("../../../model/seller");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const findSellersAllProduct = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: ["-tags", "-instaId", "-isDeleted"],
      populate: {
        path: "sellerId",
        select: [
          "isActive",
          "isDeleted",
          "isOnboarded",
          "username",
          "shopname",
        ],
      },
    };

    let query = {
      isDeleted: false,
    };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.color) {
      query["colors.name"] = req.query.color;
    }

    if (req.query.size) {
      query["sizes.size"] = req.query.size;
    }

    if (req.params.username) {
      const seller = await Seller.findOne({
        username: req.params.username,
      });
      if (!seller) {
        return res.json({
          status: "SELLERNOTFOUND",
        });
      }
      query.sellerId = seller._id;
    }

    // const chacheproducts = myCache.get(
    //   `sellerproductsclient${req.params.username}`
    // );

    // if (chacheproducts) {
    //   return res.success({ data: JSON.parse(chacheproducts) });
    // } else {
    let foundProducts = await dbService.paginate(Product, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      return res.recordNotFound();
    }

    // myCache.set(
    //   `sellerproductsclient${req.params.username}`,
    //   JSON.stringify(foundProducts),
    //   3600
    // );
    return res.success({ data: foundProducts });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const searchSellerProducts = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: ["-tags", "-instaId", "-isDeleted"],
      populate: {
        path: "sellerId",
        select: ["username", "shopname"],
      },
    };

    let query = {
      isDeleted: false,
    };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.color) {
      query["colors.name"] = req.query.color;
    }

    if (req.query.size) {
      query["sizes.size"] = req.query.size;
    }

    if (req.query.query) {
      const regex = new RegExp(req.query.query, "i");
      query.$or = [
        { name: regex },
        { desc: regex },
        { tags: regex },
        { brand: regex },
      ];
    }

    if (req.params.username) {
      const seller = await Seller.findOne({
        username: req.params.username,
      });
      if (!seller) {
        return res.json({
          status: "SELLERNOTFOUND",
        });
      }
      query.sellerId = seller._id;
    }

    // const chacheproducts = myCache.get("sellersearchedproductsclient");

    // if (chacheproducts) {
    //   return res.success({ data: JSON.parse(chacheproducts) });
    // } else {
    let foundProducts = await dbService.paginate(Product, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      return res.recordNotFound();
    }

    // myCache.set(
    //   "sellersearchedproductsclient",
    //   JSON.stringify(foundProducts),
    //   3600
    // );

    return res.success({ data: foundProducts });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const seller = req.params.seller;

    // const chacheproduct = myCache.get("sellersingleproductclient");

    // if (chacheproduct) {
    //   return res.success({ data: JSON.parse(chacheproduct) });
    // } else {
    const product = await Product.findById(productId).populate({
      path: "sellerId",
      select: "shopname username ",
    });

    if (product?.isDeleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product?.sellerId?.username == seller) {
      // myCache.set("sellersingleproductclient", JSON.stringify(product), 3600);
      res.json(product);
    } else {
      return res
        .status(404)
        .json({ error: "This Product is not found from this seller" });
    }
    // }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", error: error?.message });
  }
};

module.exports = {
  findSellersAllProduct,
  getProductById,
  searchSellerProducts,
};
