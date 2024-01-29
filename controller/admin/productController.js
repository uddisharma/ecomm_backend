const Product = require("../../model/product");
const Category = require("../../model/category");
const productSchemaKey = require("../../utils/validation/productValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const utils = require("../../utils/common");
const Seller = require("../../model/seller");

const addProduct = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      productSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    // dataToCreate.addedBy = req.user.id;
    dataToCreate = new Product(dataToCreate);
    let createdProduct = await dbService.create(Product, dataToCreate);
    return res.success({ data: createdProduct });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const bulkInsertProduct = async (req, res) => {
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
        // addedBy: req.user.id,
      };
    }
    let createdProducts = await dbService.create(Product, dataToCreate);
    createdProducts = { count: createdProducts ? createdProducts.length : 0 };
    return res.success({ data: { count: createdProducts.count || 0 } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllProduct = async (req, res) => {
  try {
    // let options = {};
    // let query = {};
    // let validateRequest = validation.validateFilterWithJoi(
    //   req.body,
    //   productSchemaKey.findFilterKeys,
    //   Product.schema.obj
    // );
    // if (!validateRequest.isValid) {
    //   return res.validationError({ message: `${validateRequest.message}` });
    // }
    // if (typeof req.body.query === "object" && req.body.query !== null) {
    //   query = { ...req.body.query };
    // }
    // if (req.body.isCountOnly) {
    //   let totalRecords = await dbService.count(Product, query);
    //   return res.success({ data: { totalRecords } });
    // }
    // if (
    //   req.body &&
    //   typeof req.body.options === "object" &&
    //   req.body.options !== null
    // ) {
    //   options = { ...req.body.options };
    // }
    // let foundProducts = await dbService.paginate(Product, query, options);
    // if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
    //   return res.recordNotFound();
    // }

    const data = await Product.find();
    return res.success({ data: data });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSellersAllProduct = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: ["-sizes", "-tags", "-instaId", "-brand"],
      populate: [
        { path: "sellerId", select: "username" },
        { path: "category", select: "name" },
      ],
    };
    let category = req.query.category;
    let query = category
      ? {
          category: category,
        }
      : {};

    if (req.params.username) {
      // Find the seller based on the username
      const seller = await Seller.findOne({
        username: req.params.username,
      });

      if (!seller) {
        return res.recordNotFound({
          message: "Seller not found with the provided username.",
        });
      }
      query.sellerId = seller._id;
    }

    let foundProducts = await dbService.paginate(Product, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundProducts });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSellersRelatedProducts = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: ["-sizes", "-colors", "-tags", "-instaId", "-brand"],
      populate: [
        { path: "sellerId", select: "username" },
        { path: "category", select: "name" },
      ],
    };
    let category = req.query.category;
    let query = {
      category: category,
    };

    if (req.params.username) {
      const seller = await Seller.findOne({
        username: req.params.username,
      });

      if (!seller) {
        return res.recordNotFound({
          message: "Seller not found with the provided username.",
        });
      }
      query.sellerId = seller._id;
    }

    let foundProducts = await dbService.paginate(Product, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      let query = {};
      foundProducts = await dbService.paginate(Product, query, options);
    }

    return res.success({ data: foundProducts });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSellersAllProductForSearch = async (req, res) => {
  try {
    let options = {
      limit: Number(1000),
      select: ["name", "brand"],
    };
    let query = {};

    if (req.params.username) {
      const seller = await Seller.findOne({
        username: req.params.username,
      });

      if (!seller) {
        return res.recordNotFound({
          message: "Seller not found with the provided username.",
        });
      }
      query.sellerId = seller._id;
    }

    let foundProducts = await dbService.paginate(Product, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundProducts });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

async function populateParentCategories(category) {
  if (
    category.parentCategoryId &&
    typeof category.parentCategoryId === "object"
  ) {
    // If parentCategoryId is an object, manually populate it
    const parentCategory = await Category.findById(category.parentCategoryId);

    // Update the category with the populated parent
    category.parentCategoryId = parentCategory;

    // Recursively populate the parent categories for the current parentCategoryId
    await populateParentCategories(category.parentCategoryId);
  }
}

async function populateProductCategories(product) {
  if (product.category && typeof product.category === "object") {
    // If category is an object, manually populate it
    const populatedCategory = await Category.findById(product.category);

    // Update the product with the populated category
    product.category = populatedCategory;

    // Recursively populate the parent categories for the product's category
    await populateParentCategories(product.category);
  }
}

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const seller = req.params.seller;

    const product = await Product.findById(productId).populate({
      path: "sellerId",
      select: "shopname username deliverypartner shopaddress",
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product?.sellerId?.username == seller) {
      res.json(product);
    } else {
      return res
        .status(404)
        .json({ error: "This Product is not found from this seller" });
    }
    // await populateProductCategories(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProduct = async (req, res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message: "invalid objectId." });
    }
    query._id = req.params.id;

    let foundProduct = await dbService.findOne(Product, query, options);

    if (!foundProduct) {
      return res.recordNotFound();
    }
    return res.success({ data: foundProduct });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getProductCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      productSchemaKey.findFilterKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === "object" && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedProduct = await dbService.count(Product, where);
    return res.success({ data: { count: countedProduct } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      // updatedBy: req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      productSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    const query = { _id: req.params.id };
    let updatedProduct = await dbService.updateOne(
      Product,
      query,
      dataToUpdate
    );
    if (!updatedProduct) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedProduct });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const bulkUpdateProduct = async (req, res) => {
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
    let updatedProduct = await dbService.updateMany(
      Product,
      filter,
      dataToUpdate
    );
    if (!updatedProduct) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: updatedProduct } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const partialUpdateProduct = async (req, res) => {
  try {
    if (!req.params.id) {
      res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    delete req.body["addedBy"];
    let dataToUpdate = {
      ...req.body,
      updatedBy: req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      productSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    const query = { _id: req.params.id };
    let updatedProduct = await dbService.updateOne(
      Product,
      query,
      dataToUpdate
    );
    if (!updatedProduct) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedProduct });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const softDeleteProduct = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    let query = { _id: req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedProduct = await dbService.updateOne(Product, query, updateBody);
    if (!updatedProduct) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedProduct });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    const query = { _id: req.params.id };
    const deletedProduct = await dbService.deleteOne(Product, query);
    if (!deletedProduct) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedProduct });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteManyProduct = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id: { $in: ids } };
    const deletedProduct = await dbService.deleteMany(Product, query);
    if (!deletedProduct) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: deletedProduct } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const softDeleteManyProduct = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id: { $in: ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedProduct = await dbService.updateMany(Product, query, updateBody);
    if (!updatedProduct) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: updatedProduct } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addProduct,
  bulkInsertProduct,
  findAllProduct,
  getProduct,
  getProductCount,
  updateProduct,
  bulkUpdateProduct,
  partialUpdateProduct,
  softDeleteProduct,
  deleteProduct,
  deleteManyProduct,
  softDeleteManyProduct,
  findSellersAllProduct,
  getProductById,
  findSellersAllProductForSearch,
  findSellersRelatedProducts,
};
