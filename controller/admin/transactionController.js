const WalletTransaction = require("../../model/transactions");
const walletTransactionSchemaKey = require("../../utils/validation/TransactionValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");

const addWalletTransaction = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      walletTransactionSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    dataToCreate = new WalletTransaction(dataToCreate);
    let createdWalletTransaction = await dbService.create(
      WalletTransaction,
      dataToCreate
    );
    return res.success({ data: createdWalletTransaction });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllWalletTransaction = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      populate: [{ path: "seller", select: "username shopname" }],
      sort: "-updatedAt",
    };
    let query = {
      isDeleted: req.query.isDeleted,
    };

    let foundWalletTransactions = await dbService.paginate(
      WalletTransaction,
      query,
      options
    );
    if (
      !foundWalletTransactions ||
      !foundWalletTransactions.data ||
      !foundWalletTransactions.data.length
    ) {
      return res.recordNotFound();
    }
    return res.success({ data: foundWalletTransactions });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getWalletTransaction = async (req, res) => {
  try {
    const foundWalletTransaction = await WalletTransaction?.findById(
      req.params.id
    ).populate({
      path: "seller",
      select: "username shopname shopaddress email",
    });
    if (!foundWalletTransaction) {
      return res.recordNotFound();
    }
    return res.success({ data: foundWalletTransaction });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getWalletTransactionCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      walletTransactionSchemaKey.findFilterKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === "object" && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedWalletTransaction = await dbService.count(
      WalletTransaction,
      where
    );
    return res.success({ data: { count: countedWalletTransaction } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateWalletTransaction = async (req, res) => {
  try {
    // return res.send(req.body);
    let dataToUpdate = {
      ...req.body,
      // updatedBy: req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      walletTransactionSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    const query = { _id: req.params.id };
    let updatedWalletTransaction = await dbService.updateOne(
      WalletTransaction,
      query,
      dataToUpdate
    );
    if (!updatedWalletTransaction) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedWalletTransaction });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const bulkUpdateWalletTransaction = async (req, res) => {
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
    let updatedWalletTransaction = await dbService.updateMany(
      WalletTransaction,
      filter,
      dataToUpdate
    );
    if (!updatedWalletTransaction) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: updatedWalletTransaction } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const softDeleteWalletTransaction = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    let query = { _id: req.params.id };
    const updateBody = {
      isDeleted: req.body.isDeleted,
      // updatedBy: req.user.id,
    };
    let updatedWalletTransaction = await dbService.updateOne(
      WalletTransaction,
      query,
      updateBody
    );
    if (!updatedWalletTransaction) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedWalletTransaction });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteWalletTransaction = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    const query = { _id: req.params.id };
    const deletedWalletTransaction = await dbService.deleteOne(
      WalletTransaction,
      query
    );
    if (!deletedWalletTransaction) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedWalletTransaction });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSellersTransaction = async (req, res) => {
  try {
    let options = {};
    if (req.query.page) {
      options = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        skip: (Number(req.query.page) - 1) * Number(req.query.limit),
        sort: "-createdAt",
      };
    }
    const query = {
      seller: req.params.id,
      isDeleted: req.query.isDeleted,
    };

    let foundTransactions = await dbService.paginate(
      WalletTransaction,
      query,
      options
    );

    if (
      !foundTransactions ||
      !foundTransactions.data ||
      !foundTransactions.data.length
    ) {
      return res.recordNotFound();
    }

    return res.success({ data: foundTransactions });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addWalletTransaction,
  findAllWalletTransaction,
  getWalletTransaction,
  getWalletTransactionCount,
  updateWalletTransaction,
  bulkUpdateWalletTransaction,
  softDeleteWalletTransaction,
  deleteWalletTransaction,
  findSellersTransaction,
};
