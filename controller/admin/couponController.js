const Coupon = require("../../model/coupons");
const couponSchemaKey = require("../../utils/validation/coupnValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const addCoupon = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      couponSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    dataToCreate = new Coupon(dataToCreate);
    let createdCoupon = await dbService.create(Coupon, dataToCreate);
    // myCache.del("findSellersCouponsadmin");
    // myCache.del("singlecouponseller");
    // myCache.del("sellercouponsseller");
    // myCache.del("singlecouponcountseller");
    return res.success({ data: createdCoupon });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSellersCoupons = async (req, res) => {
  try {
    let options = {};
    if (req.query.page) {
      options = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        skip: (Number(req.query.page) - 1) * Number(req.query.limit),
        populate: [{ path: "seller", select: "username" }],
        sort: "-updatedAt",
      };
    }
    const query = {
      seller: req.params.seller,
      isDeleted: req.query.isDeleted,
    };

    // const chachedcoupons = myCache.get("findSellersCouponsadmin");

    // if (chachedcoupons) {
    //   return res.success({ data: JSON.parse(chachedcoupons) });
    // } else {
      let foundCoupons = await dbService.paginate(Coupon, query, options);

      if (!foundCoupons || !foundCoupons.data || !foundCoupons.data.length) {
        return res.recordNotFound();
      }
      // myCache.set(
      //   "findSellersCouponsadmin",
      //   JSON.stringify(foundCoupons),
      //   21600
      // );
      return res.success({ data: foundCoupons });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getCoupon = async (req, res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message: "invalid objectId." });
    }
    query._id = req.params.id;
    let options = {};
    let foundCoupon = await dbService.findOne(Coupon, query, options);
    if (!foundCoupon) {
      return res.recordNotFound();
    }
    return res.success({ data: foundCoupon });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      couponSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    const query = { _id: req.params.id };
    let updatedCoupon = await dbService.updateOne(Coupon, query, dataToUpdate);
    if (!updatedCoupon) {
      return res.recordNotFound();
    }
    // myCache.del("findSellersCouponsadmin");
    // myCache.del("singlecouponseller");
    // myCache.del("sellercouponsseller");
    // myCache.del("singlecouponcountseller");
    return res.success({ data: updatedCoupon });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    const deletedcoupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!deletedcoupon) {
      return res.recordNotFound();
    }
    // myCache.del("findSellersCouponsadmin");
    // myCache.del("singlecouponseller");
    // myCache.del("sellercouponsseller");
    // myCache.del("singlecouponcountseller");
    return res.success({ data: deletedcoupon });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addCoupon,
  findSellersCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
