const Product = require("../../../model/product");
const productSchemaKey = require("../../../utils/validation/productValidation");
const validation = require("../../../utils/validateRequest");
const dbService = require("../../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const addProduct = async (req, res) => {
  try {
    let dataToCreate = { ...req.body, sellerId: req.user.id };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      productSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
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
      };
    }
    let createdProducts = await dbService.create(Product, dataToCreate);
    createdProducts = { count: createdProducts ? createdProducts.length : 0 };
    // myCache.del("sellerproductsclient");
    // myCache.del("sellersearchedproductsclient");
    // myCache.del("sellersingleproductclient");
    // myCache.del("sellerproductsseller");
    // myCache.del("sellersingleproductseller");
    // myCache.del("sellerproductscountseller");

    return res.success({ data: { count: createdProducts.count || 0 } });
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
      select: [
        "-sizes",
        "-tags",
        "-instaId",
        "-brand",
        "-colors",
        "-length",
        "-breadth",
        "-height",
        "-weight",
        "-desc",
      ],
      populate: [
        { path: "category", select: "name" },
        {
          path: "sellerId",
          select: "username shopname",
        },
      ],
      sort: { createdAt: -1 },
    };

    let query = {
      sellerId: req.user.id,
      isDeleted: req.query.isDeleted,
    };

    // const chachedproducts = myCache.get("sellerproductsseller");

    // if (chachedproducts) {
    //   return res.success({ data: JSON.parse(chachedproducts) });
    // } else {
    let foundProducts = await dbService.paginate(Product, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      return res.recordNotFound();
    }
    // myCache.set("sellerproductsseller", JSON.stringify(foundProducts), 21600);
    return res.success({ data: foundProducts });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message: "invalid objectId." });
    }
    // const chachedproduct = myCache.get("sellersingleproductseller");
    // if (chachedproduct) {
    //   return res.success({ data: JSON.parse(chachedproduct) });
    // } else {
    const foundProduct = await Product.findById(req.params.id).populate([
      {
        path: "category",
        populate: {
          path: "parentCategoryId",
          populate: {
            path: "parentCategoryId",
          },
        },
      },
    ]);
    if (!foundProduct) {
      return res.recordNotFound();
    }
    // myCache.set(
    //   "sellersingleproductseller",
    //   JSON.stringify(foundProduct),
    //   500
    // );
    return res.success({ data: foundProduct });
    // }
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

    // const chachedproducts = myCache.get("sellerproductscountseller");
    // if (chachedproducts) {
    //   return res.success({ data: JSON.parse(chachedproducts) });
    // } else {
    let countedProduct = await dbService.count(Product, where);

    // myCache.set(
    //   "sellerproductscountseller",
    //   JSON.stringify(countedProduct),
    //   500
    // );
    return res.success({ data: { count: countedProduct } });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
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
    // myCache.del("sellerproductsclient");
    // myCache.del("sellersearchedproductsclient");
    // myCache.del("sellersingleproductclient");
    // myCache.del("sellerproductsseller");
    // myCache.del("sellersingleproductseller");
    // myCache.del("sellerproductscountseller");
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
      isDeleted: req.body.isDeleted,
    };
    let updatedProduct = await dbService.updateOne(Product, query, updateBody);
    if (!updatedProduct) {
      return res.recordNotFound();
    }
    // myCache.del("sellerproductsclient");
    // myCache.del("sellersearchedproductsclient");
    // myCache.del("sellersingleproductclient");
    // myCache.del("sellerproductsseller");
    // myCache.del("sellersingleproductseller");
    // myCache.del("sellerproductscountseller");
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
    // myCache.del("sellerproductsclient");
    // myCache.del("sellersearchedproductsclient");
    // myCache.del("sellersingleproductclient");
    // myCache.del("sellerproductsseller");
    // myCache.del("sellersingleproductseller");
    // myCache.del("sellerproductscountseller");
    return res.success({ data: deletedProduct });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addProduct,
  bulkInsertProduct,
  findSellersAllProduct,
  getProduct,
  getProductCount,
  updateProduct,
  softDeleteProduct,
  deleteProduct,
};
