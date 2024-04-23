const Seller = require("../../../model/seller");
const dbService = require("../../../utils/dbService");
const axios = require("axios");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const findAllSellers = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: [
        "socialLinks",
        "username",
        "email",
        "mobileNo",
        "discount",
        "description",
        "cover",
        "shopname",
        "shopaddress",
      ],
    };

    let query = {
      isActive: true,
      isDeleted: false,
      isOnboarded: true,
    };

    // const chachedsellers = myCache.get("findAllSellersClient");

    // if (chachedsellers) {
    //   return res.success({ data: JSON.parse(chachedsellers) });
    // } else {
    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    // myCache.set("findAllSellersClient", JSON.stringify(foundSellers), 3600);
    return res.success({ data: foundSellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const loginToDeliveryRates = async (email, password) => {
  const data = JSON.stringify({ email, password });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.nimbuspost.com/v1/users/login",
    headers: { "Content-Type": "application/json" },
    data,
  };

  try {
    const response = await axios(config);

    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

const getSellerDetailsForCheckOut = async (req, res) => {
  try {
    const seller = await Seller.findOne({
      username: req.params.username,
    }).select("deliverypartner shopaddress charge isActive");
    const { email, password, warehouses } =
      seller?.deliverypartner?.partner || {};
    const token = await loginToDeliveryRates(email, password);

    const warehouse = warehouses?.filter((e) => {
      return e?.default == true;
    })[0];

    return res.success({
      data: {
        warehouse: warehouse,
        token: token,
        charge: seller.charge,
        address: seller.shopaddress?.pincode,
        delivery: seller?.deliverypartner?.personal,
        storestatus: seller?.isActive,
      },
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllSellersWithCategory = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: [
        "socialLinks",
        "username",
        "email",
        "mobileNo",
        "discount",
        "description",
        "cover",
        "shopname",
        "shopaddress",
        "sellingCategory",
      ],
    };

    let categoryId = req.params.category;
    let query = categoryId
      ? {
          "sellingCategory.category": categoryId,
          isActive: true,
          isDeleted: false,
          isOnboarded: true,
        }
      : {
          isActive: true,
          isDeleted: false,
          isOnboarded: true,
        };

    // const chachedsellers = myCache.get("findAllSellersWithCategoryClient");

    // if (chachedsellers) {
    //   return res.success({ data: JSON.parse(chachedsellers) });
    // } else {
    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }

    // myCache.set(
    //   "findAllSellersWithCategoryClient",
    //   JSON.stringify(foundSellers),
    //   3600
    // );
    return res.success({ data: foundSellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getSellingCategoryofSeller = async (req, res) => {
  try {
    // const chachedsellerCategories = myCache.get(
    //   "getSellingCategoryofSellerClient"
    // );

    // if (chachedsellerCategories) {
    //   return res.success({ data: JSON.parse(chachedsellerCategories) });
    // } else {
    const seller = await Seller.findOne({
      username: req.params.username,
    })
      .select("sellingCategory")
      .populate({
        path: "sellingCategory.category",
        populate: {
          path: "parentCategoryId",
          populate: {
            path: "parentCategoryId",
          },
        },
      });

    if (!seller || !seller.sellingCategory) {
      return res.json({
        status: "SELLERNOTFOUND",
      });
    }
    // myCache.set(
    //   "getSellingCategoryofSellerClient",
    //   JSON.stringify(seller),
    //   3600
    // );
    return res.success({ data: seller });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const searchSeller = async (req, res) => {
  try {
    const { query } = req;
    let filter = {};

    if (query.query) {
      const regex = new RegExp(query.query, "i");
      filter.$or = [
        { shopname: regex },
        { username: regex },
        { "shopaddress.address1": regex },
        { "owner.personal.name": regex },
        { description: regex },
      ];
    }

    // const chachedsellers = myCache.get("searchSellerclient");

    // if (chachedsellers) {
    //   return res.success({ data: JSON.parse(chachedsellers) });
    // } else {
    const sellers = await Seller.find(filter);

    if (sellers == null || sellers?.length <= 0) {
      return res.recordNotFound();
    }
    // myCache.set("searchSellerclient", JSON.stringify(sellers), 3600);
    return res.success({ data: sellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  findAllSellers,
  findAllSellersWithCategory,
  getSellingCategoryofSeller,
  getSellerDetailsForCheckOut,
  searchSeller,
};
