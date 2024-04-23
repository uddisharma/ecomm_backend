const Banner = require("../../model/banner");
const bannerSchemaKey = require("../../utils/validation/bannerValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const addBanner = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      bannerSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    dataToCreate = new Banner(dataToCreate);
    let createdBanner = await dbService.create(Banner, dataToCreate);
    // myCache.del("findAllSellersBanneradmin");
    // myCache.del("findAllBanneradmin");
    // myCache.del("sellerbannersclient");
    // myCache.del("sellerbannersseller");
    return res.success({ data: createdBanner });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllBanner = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      sort: "-updatedAt",
    };
    let query = {
      sellerId: null,
      isDeleted: req.query.isDeleted,
    };
    // const chachedbanners = myCache.get("findAllBanneradmin");
    // if (chachedbanners) {
    //   return res.success({ data: JSON.parse(chachedbanners) });
    // } else {
    let foundSellers = await dbService.paginate(Banner, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    // myCache.set("findAllBanneradmin", JSON.stringify(foundBanners), 21600);
    return res.success({ data: foundSellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllSellersBanner = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      sort: "-updatedAt",
    };
    let query = {
      sellerId: req.params?.sellerId,
      isDeleted: req.query.isDeleted,
    };
    // const chachedbanners = myCache.get("findAllSellersBanneradmin");
    // if (chachedbanners) {
    //   return res.success({ data: JSON.parse(chachedbanners) });
    // } else {
    let foundSellers = await dbService.paginate(Banner, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    // myCache.set(
    //   "findAllSellersBanneradmin",
    //   JSON.stringify(foundBanners),
    //   21600
    // );
    return res.success({ data: foundSellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getBanner = async (req, res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message: "invalid objectId." });
    }
    query._id = req.params.id;
    let options = {};
    let foundBanner = await dbService.findOne(Banner, query, options);
    if (!foundBanner) {
      return res.recordNotFound();
    }
    return res.success({ data: foundBanner });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      bannerSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    const query = { _id: req.params.id };
    let updatedBanner = await dbService.updateOne(Banner, query, dataToUpdate);
    if (!updatedBanner) {
      return res.recordNotFound();
    }
    // myCache.del("findAllSellersBanneradmin");
    // myCache.del("findAllBanneradmin");
    // myCache.del("sellerbannersclient");
    // myCache.del("sellerbannersseller");
    return res.success({ data: updatedBanner });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const softDeleteBanner = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    let query = { _id: req.params.id };
    const updateBody = {
      isDeleted: req.body.isDeleted,
    };
    let updatedBanner = await dbService.updateOne(Banner, query, updateBody);
    if (!updatedBanner) {
      return res.recordNotFound();
    }
    // myCache.del("findAllSellersBanneradmin");
    // myCache.del("findAllBanneradmin");
    // myCache.del("sellerbannersclient");
    // myCache.del("sellerbannersseller");
    return res.success({ data: updatedBanner });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    const query = { _id: req.params.id };
    const deletedBanner = await dbService.deleteOne(Banner, query);
    if (!deletedBanner) {
      return res.recordNotFound();
    }
    // myCache.del("findAllSellersBanneradmin");
    // myCache.del("findAllBanneradmin");
    // myCache.del("sellerbannersclient");
    // myCache.del("sellerbannersseller");
    return res.success({ data: deletedBanner });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addBanner,
  findAllBanner,
  getBanner,
  updateBanner,
  softDeleteBanner,
  deleteBanner,
  findAllSellersBanner,
};
