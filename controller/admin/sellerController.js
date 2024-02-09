/**
 * userController.js
 * @description : exports action methods for user.
 */

const Seller = require("../../model/seller");
const userSchemaKey = require("../../utils/validation/userValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const auth = require("../../services/auth");
const deleteDependentService = require("../../utils/deleteDependent");
const utils = require("../../utils/common");
const category = require("../../model/category");

function validateData(data) {
  const requiredFields = [];

  // Step 1
  if (!data.shopname) {
    requiredFields.push("shopname");
  }
  if (!data.username) {
    requiredFields.push("username");
  }
  if (!data.cover) {
    requiredFields.push("cover");
  }
  if (!data.email) {
    requiredFields.push("email");
  }
  if (!data.mobileNo) {
    requiredFields.push("mobileNo");
  }
  if (!data.alternatemobileNo) {
    requiredFields.push("alternatemobileNo");
  }
  if (!data.description) {
    requiredFields.push("description");
  }

  // Step 2
  if (
    !data.shopaddress ||
    !data.shopaddress.pincode ||
    !data.shopaddress.address1 ||
    !data.shopaddress.address2 ||
    !data.shopaddress.landmark ||
    !data.shopaddress.city ||
    !data.shopaddress.state
  ) {
    requiredFields.push("shopaddress");
  }

  // Step 3
  if (!data.sellingCategory || data.sellingCategory.length === 0) {
    requiredFields.push("sellingCategory");
  } else {
    for (const category of data.sellingCategory) {
      if (!category.category || !category.photo) {
        requiredFields.push("sellingCategory");
        break;
      }
    }
  }

  // Step 4
  if (!data.socialLinks || !data.socialLinks.instagram) {
    requiredFields.push("socialLinks");
  }

  // Step 5
  if (
    !data.owner ||
    !data.owner.personal ||
    !data.owner.personal.name ||
    !data.owner.personal.phone ||
    !data.owner.personal.email ||
    !data.owner.address ||
    !data.owner.address.pincode ||
    !data.owner.address.address1 ||
    !data.owner.address.address2 ||
    !data.owner.address.landmark ||
    !data.owner.address.city ||
    !data.owner.address.state
  ) {
    requiredFields.push("owner");
  }

  // Step 6
  if (
    !data.legal ||
    !data.legal.aadhar ||
    !data.legal.aadhar.name ||
    !data.legal.aadhar.address ||
    !data.legal.aadhar.careof ||
    !data.legal.aadhar.aadharnumber ||
    data.legal.aadhar.aadharnumber.length !== 12 ||
    data.legal.aadhar.signed !== true ||
    !data.legal.pan ||
    !data.legal.pan.name ||
    !data.legal.pan.type ||
    !data.legal.pan.pannumber ||
    data.legal.pan.pannumber.length !== 10 ||
    data.legal.pan.signed !== true ||
    !data.legal.bank ||
    !data.legal.bank.name ||
    !data.legal.bank.branch ||
    !data.legal.bank.account ||
    !data.legal.bank.ifsc ||
    data.legal.bank.signed !== true ||
    !data.legal.gst ||
    !data.legal.taxid ||
    !data.legal.certificate ||
    data.legal.certificate.length < 3 ||
    data.legal.signed !== true
  ) {
    requiredFields.push("legal");
  }

  // Step 7
  if (
    !data.deliverypartner ||
    !data.deliverypartner.personal ||
    !data.deliverypartner.personal.have ||
    !data.deliverypartner.partner ||
    !data.deliverypartner.partner.email ||
    !data.deliverypartner.partner.password ||
    !data.deliverypartner.partner.warehouses ||
    data.deliverypartner.partner.warehouses.length === 0
  ) {
    requiredFields.push("deliverypartner");
  } else {
    for (const warehouse of data.deliverypartner.partner.warehouses) {
      if (
        !warehouse.warehouse_name ||
        !warehouse.name ||
        !warehouse.address ||
        !warehouse.address_2 ||
        !warehouse.city ||
        !warehouse.state ||
        !warehouse.pincode ||
        !warehouse.phone ||
        !warehouse.default
      ) {
        requiredFields.push("deliverypartner");
        break;
      }
    }
  }

  // Additional fields
  if (!data.rating || !data.rating.rate || !data.rating.total) {
    requiredFields.push("rating");
  }
  if (!data.charge) {
    requiredFields.push("charge");
  }
  if (!data.isActive) {
    requiredFields.push("isActive");
  }
  if (data.isDeleted) {
    requiredFields.push("isDeleted");
  }
  if (data.isOnboarded) {
    requiredFields.push("isOnboarded");
  }

  return requiredFields;
}

const addSeller = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }

    dataToCreate = new Seller(dataToCreate);
    let createdUser = await dbService.create(Seller, dataToCreate);
    return res.success({ data: createdUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getSellerDetailsForCheckOut = async (req, res) => {
  try {
    const seller = await Seller.findOne({
      username: req.params.username,
    }).select("deliverypartner shopaddress");
    return res.success({ data: { seller } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const bulkInsertSellers = async (req, res) => {
  try {
    if (
      req.body &&
      (!Array.isArray(req.body.data) || req.body.data.length < 1)
    ) {
      return res.badRequest();
    }
    let dataToCreate = [...req.body.data];
    for (let i = 0; i < dataToCreate.length; i++) {
      dataToCreate[i] = {
        ...dataToCreate[i],
      };
    }
    let createdSellers = await dbService.create(Seller, dataToCreate);
    createdSellers = { count: createdSellers ? createdSellers.length : 0 };
    return res.success({ data: { count: createdSellers.count || 0 } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getLoggedInSellerInfo = async (req, res) => {
  try {
    const query = {
      _id: req.seller.id,
      isDeleted: false,
    };
    query.isActive = true;
    let foundSeller = await dbService.findOne(Seller, query);
    if (!foundSeller) {
      return res.recordNotFound();
    }
    return res.success({ data: foundSeller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllSellers = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: ["-legal", "-deliverypartner", "-resetPasswordLink", "-owner"],
    };
    let query = { isDeleted: false };

    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    return res.success({ data: foundSellers });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllSellersWithPendingOnboarding = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: ["-legal", "-deliverypartner", "-resetPasswordLink", "-owner"],
      sort: "-createdAt",
    };
    let query = { isDeleted: false, isOnboarded: false };
    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    return res.success({ data: foundSellers });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllSellersWithDeleted = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: ["-legal", "-deliverypartner", "-resetPasswordLink", "-owner"],
      sort: "-createdAt",
    };
    let query = { isDeleted: true };
    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    return res.success({ data: foundSellers });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSingleSeller = async (req, res) => {
  const searchTerm = req.query.term;
  try {
    const sellers = await Seller.find({
      $or: [
        { shopname: { $regex: searchTerm, $options: "i" } },
        { username: { $regex: searchTerm, $options: "i" } },
      ],
      isDeleted: false,
    }).select("shopname username");
    if (sellers?.length <= 0) {
      return res.recordNotFound();
    }
    return res.success({ data: sellers });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSingleSellerWithPendingOnboarding = async (req, res) => {
  const searchTerm = req.query.term;

  try {
    const sellers = await Seller.find({
      $or: [
        { shopname: { $regex: searchTerm, $options: "i" } },
        { username: { $regex: searchTerm, $options: "i" } },
      ],
      isOnboarded: false,
      isDeleted: false,
    }).select("shopname username shopaddress email mobileNo");
    if (sellers?.length <= 0) {
      return res.recordNotFound();
    }
    return res.success({ data: sellers });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSingleSellerWithdeleted = async (req, res) => {
  const searchTerm = req.query.term;

  try {
    const sellers = await Seller.find({
      $or: [
        { shopname: { $regex: searchTerm, $options: "i" } },
        { username: { $regex: searchTerm, $options: "i" } },
      ],
      isDeleted: true,
    }).select("shopname username shopaddress email mobileNo");
    if (sellers?.length <= 0) {
      return res.recordNotFound();
    }
    return res.success({ data: sellers });
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
      select: ["-legal", "-deliverypartner", "-resetPasswordLink", "-owner"],
    };

    let categoryId = req.params.category;
    let query = categoryId
      ? {
          "sellingCategory.category": categoryId,
        }
      : {};

    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundSellers });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getSellingCategoryofSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params?.seller)
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

    // Check if seller or selling category was found
    if (!seller || !seller.sellingCategory) {
      return res.notFound({ message: "Seller or selling category not found" });
    }

    // Return the seller data with populated and nested parent category name
    return res.success({ data: seller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllSellersForSearch = async (req, res) => {
  try {
    const data = await Seller.find().select("shopname username");
    if (data) {
      res.send(data);
    } else {
      res.send("no data found");
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { sellerId, categoryId } = req.params;
    const existingShop = await Seller.findById(sellerId).populate({
      path: "sellingCategory.category",
      select: ["-createdAt", "-updatedAt"],
      populate: {
        path: "parentCategoryId",
        select: ["-createdAt", "-updatedAt"],
        populate: {
          path: "parentCategoryId",
          select: ["-createdAt", "-updatedAt"],
        },
      },
    });
    if (!existingShop) {
      return res.status(404).json({ error: "Shop not found" });
    }
    const password = existingShop?.password;

    const categoryIndex = existingShop.sellingCategory?.findIndex(
      (category) => category.category?._id?.toString() === categoryId
    );

    if (categoryIndex === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    existingShop.sellingCategory.splice(categoryIndex, 1);
    existingShop.password = password;

    await existingShop.save();

    const seller = await Seller.findById(existingShop?._id).populate({
      path: "sellingCategory.category",
      select: ["-createdAt", "-updatedAt"],
      populate: {
        path: "parentCategoryId",
        select: ["-createdAt", "-updatedAt"],
        populate: {
          path: "parentCategoryId",
          select: ["-createdAt", "-updatedAt"],
        },
      },
    });

    return res.success({ data: seller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getSeller = async (req, res) => {
  try {
    if (req.body.includeRoleAccess) {
      roleAccess = req.body.includeRoleAccess;
    }
    const user = await Seller.findById(req.params.id)
      .populate({
        path: "sellingCategory.category",
        select: ["-createdAt", "-updatedAt"],
        populate: {
          path: "parentCategoryId",
          select: ["-createdAt", "-updatedAt"],
          populate: {
            path: "parentCategoryId",
            select: ["-createdAt", "-updatedAt"],
          },
        },
      })
      .select("-resetPasswordLink -password");
    if (user) {
      return res.success({
        data: { user },
      });
    } else {
      return res.recordNotFound();
    }
  } catch (error) {
    return res.internalServerError({ data: error.message });
  }
};

const getSellerCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      userSchemaKey.findFilterKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === "object" && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedUser = await dbService.count(Seller, where);
    return res.success({ data: { count: countedUser } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateSeller = async (req, res) => {
  try {
    // return res.send(req.body);
    let dataToUpdate = {
      ...req.body,
    };
    const query = {
      _id: {
        $eq: req.params.id,
      },
    };
    // let updatedSeller = await dbService.updateOne(Seller, query, dataToUpdate);
    let updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSeller) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedSeller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateAllSellers = async (req, res) => {
  try {
    let updatedSeller = await Seller.updateMany(
      { isActive: false },
      { ...req.body },
      {
        new: true,
      }
    );
    if (!updatedSeller) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedSeller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const bulkUpdateSeller = async (req, res) => {
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    delete dataToUpdate["addedBy"];
    if (
      req.body &&
      typeof req.body.data === "object" &&
      req.body.data !== null
    ) {
      dataToUpdate = {
        ...req.body.data,
        updatedBy: req.user.id,
      };
    }
    let updatedSeller = await dbService.updateMany(
      Seller,
      filter,
      dataToUpdate
    );
    if (!updatedSeller) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: updatedSeller } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteSeller = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    const query = {
      _id: {
        $eq: req.params.id,
        $ne: req.user.id,
      },
    };
    let deletedSeller;
    if (req.body.isWarning) {
      deletedSeller = await deleteDependentService.countUser(query);
    } else {
      deletedSeller = await deleteDependentService.deleteUser(query);
    }
    if (!deletedSeller) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedSeller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteSeller1 = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    return res.json({ message: "Delete Successfully" });
  } catch (error) {
    return res.json({ message: "Something went wrong", error });
  }
};

const updateSellerProfile = async (req, res) => {
  try {
    let data = req.body;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    // delete data.createdAt;
    // delete data.password;
    // delete data.updatedAt;
    // if (data.id) delete data.id;
    let result = await dbService.updateOne(
      Seller,
      { _id: req.params.id },
      data,
      {
        new: true,
      }
    );
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result, message: "Updated Successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.validationError({
        message: `Invalid Data, Validation Failed at ${error.message}`,
      });
    }
    if (error.code && error.code === 11000) {
      return res.validationError({ message: "Data duplication found." });
    }
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addSeller,
  findAllSellers,
  findAllSellersForSearch,
  getLoggedInSellerInfo,
  bulkInsertSellers,
  getSeller,
  getSellerCount,
  updateSeller,
  bulkUpdateSeller,
  deleteSeller1,
  updateSellerProfile,
  findAllSellersWithCategory,
  getSellingCategoryofSeller,
  getSellerDetailsForCheckOut,
  findSingleSeller,
  deleteCategory,
  findAllSellersWithPendingOnboarding,
  findSingleSellerWithPendingOnboarding,
  updateAllSellers,
  findAllSellersWithDeleted,
  findSingleSellerWithdeleted,
};
