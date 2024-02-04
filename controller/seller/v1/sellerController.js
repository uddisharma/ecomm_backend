/**
 * userController.js
 * @description : exports action methods for user.
 */

const Seller = require("../../../model/seller");
const userSchemaKey = require("../../../utils/validation/userValidation");
const validation = require("../../../utils/validateRequest");
const dbService = require("../../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const deleteDependentService = require("../../../utils/deleteDependent");
const auth = require("../../../services/sellerauth");

const addSeller = async (req, res) => {
  try {
    let dataToCreate = { ...({ ...req.body } || {}) };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    let exist = await Seller.findOne({ email: req.body?.email });

    if (exist) {
      return res.json({
        data: { status: "EXIST", message: "Seller already exists." },
      });
    }

    if (!exist) {
      let username = await Seller.findOne({ username: req.body?.username });
      if (username) {
        return res.json({
          data: { status: "USERNAME", message: "Username already taken !" },
        });
      }
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
    let query = {};

    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    return res.success({ data: foundSellers });
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

const addCategory = async (req, res) => {
  try {
    const { sellerId, category, photo } = req.body;

    // Validate if the shopId exists
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

    // Create a new selling category
    const newSellingCategory = {
      category,
      photo,
    };

    // Add the new selling category to the shop's sellingCategory array
    existingShop.sellingCategory.push(newSellingCategory);
    existingShop.password = password;

    // Save the updated shop without modifying the password
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

    // await existingShop.save();

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
    const foundSeller = await Seller.findById(req.params.id).populate({
      path: "sellingCategory.category",
      populate: {
        path: "parentCategoryId",
        populate: {
          path: "parentCategoryId",
        },
      },
    });
    if (!foundSeller) {
      return res.recordNotFound();
    }
    return res.success({ data: foundSeller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
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
    // return res?.send(req.body);
    let dataToUpdate = {
      ...req.body,
    };
    const query = {
      _id: {
        $eq: req.params.id,
      },
    };
    let updatedSeller = await dbService.updateOne(Seller, query, dataToUpdate);
    if (!updatedSeller) {
      return res.recordNotFound();
    }
    const seller = await Seller.findById(req.params.id).populate({
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

const changePassword = async (req, res) => {
  try {
    let params = req.body;
    if (!params.newPassword || !params.oldPassword) {
      return res.validationError({
        message: "Please Provide new Password and Old password",
      });
    }
    let result = await auth.changePassword({
      ...params,
      userId: req.params.id,
    });
    if (result.flag) {
      return res.failure({ message: result.data });
    }
    return res.success({ message: result.data });
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
    // delete data.password;
    delete data.createdAt;
    delete data.updatedAt;
    if (data.id) delete data.id;
    let result = await dbService.updateOne(Seller, { _id: req.user.id }, data, {
      new: true,
    });
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

const sellerById = async (req, res) => {
  try {
    const data = await Seller.findById(req.params?.id);
    res.send(data);
  } catch (error) {
    res.send(error);
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
  sellerById,
  addCategory,
  deleteCategory,
  changePassword,
};
