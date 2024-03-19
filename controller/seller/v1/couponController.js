const Coupon = require("../../../model/coupons");
const couponSchemaKey = require("../../../utils/validation/coupnValidation");
const validation = require("../../../utils/validateRequest");
const dbService = require("../../../utils/dbService");
const Seller = require("../../../model/seller");
const ObjectId = require("mongodb").ObjectId;

const addCoupon = async (req, res) => {
  try {
    let dataToCreate = { ...req.body, seller: req.user.id };
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
    return res.success({ data: createdCoupon });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code, username } = req.body;

    // Find the seller by username
    const seller = await Seller.findOne({ username });

    if (!seller) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Seller not found" });
    }
    const coupon = await Coupon.findOne({
      code,
      seller: seller._id,
    });

    if (!coupon) {
      return res.json({ status: "FAILED", message: "Invalid Coupon" });
    }

    return res.success({ data: coupon });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllCoupons = async (req, res) => {
  try {
    let options = {};
    if (req.query.page) {
      options = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        skip: (Number(req.query.page) - 1) * Number(req.query.limit),
        populate: [{ path: "seller", select: "username" }],
      };
    }
    const query = {};

    let foundCoupons = await dbService.paginate(Coupon, query, options);

    if (!foundCoupons || !foundCoupons.data || !foundCoupons.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundCoupons });
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
        sort: { updatedAt: -1 },
      };
    }
    const query = {
      seller: req.user.id,
      isDeleted: req.query.isDeleted,
    };

    let foundCoupons = await dbService.paginate(Coupon, query, options);

    if (!foundCoupons || !foundCoupons.data || !foundCoupons.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundCoupons });
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

const getSelllerCouponCount = async (req, res) => {
  try {
    let where = { seller: req.params.seller };
    let countedCoupon = await dbService.count(Coupon, where);
    return res.success({ data: { count: countedCoupon } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getCouponCount = async (req, res) => {
  try {
    let countedCoupon = await dbService.count(Coupon);
    return res.success({ data: { count: countedCoupon } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      seller: req.user.id,
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
    return res.success({ data: deletedcoupon });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addCoupon,
  applyCoupon,
  findAllCoupons,
  getCouponCount,
  findSellersCoupons,
  getCoupon,
  getSelllerCouponCount,
  updateCoupon,
  deleteCoupon,
};
