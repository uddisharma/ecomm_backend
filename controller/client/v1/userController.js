const User = require("../../../model/user");
const userSchemaKey = require("../../../utils/validation/userValidation");
const validation = require("../../../utils/validateRequest");
const dbService = require("../../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const auth = require("../../../services/auth");

/**
 * @description : get information of logged-in User.
 * @param {Object} req : authentication token is required
 * @param {Object} res : Logged-in user information
 * @return {Object} : Logged-in user information {status, message, data}
 */
const getLoggedInUserInfo = async (req, res) => {
  try {
    const query = {
      _id: req.user.id,
      isDeleted: false,
    };
    query.isActive = true;
    let foundUser = await dbService.findOne(User, query);
    if (!foundUser) {
      return res.recordNotFound();
    }
    return res.success({ data: foundUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : create document of User in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created User. {status, message, data}
 */
const addUser = async (req, res) => {
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
    // dataToCreate.addedBy = req.user.id;
    dataToCreate = new User(dataToCreate);
    let createdUser = await dbService.create(User, dataToCreate);
    return res.success({ data: createdUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : create multiple documents of User in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Users. {status, message, data}
 */
const bulkInsertUser = async (req, res) => {
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
        addedBy: req.user.id,
      };
    }
    let createdUsers = await dbService.create(User, dataToCreate);
    createdUsers = { count: createdUsers ? createdUsers.length : 0 };
    return res.success({ data: { count: createdUsers.count || 0 } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find all documents of User from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found User(s). {status, message, data}
 */

const findAllUser = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      userSchemaKey.findFilterKeys,
      User.schema.obj
    );

    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }

    if (typeof req.body.query === "object" && req.body.query !== null) {
      query = { ...req.body.query };
    }

    query._id = { $ne: req.user.id };

    if (req.body && req.body.query && req.body.query._id) {
      query._id.$in = [req.body.query._id];
    }

    console.log("Debug: Query to find users - ", query); // Debug log

    if (req.body.isCountOnly) {
      let totalRecords = await dbService.count(User, query);
      return res.success({ data: { totalRecords } });
    }

    if (
      req.body &&
      typeof req.body.options === "object" &&
      req.body.options !== null
    ) {
      options = { ...req.body.options };
    }

    let foundUsers = await dbService.paginate(User, query, options);

    if (!foundUsers || !foundUsers.data || !foundUsers.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundUsers });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of User from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found User. {status, message, data}
 */
const getUser = async (req, res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message: "invalid objectId." });
    }
    query._id = req.params.id;
    let options = {};
    let foundUser = await dbService.findOne(User, query, options);
    if (!foundUser) {
      return res.recordNotFound();
    }
    return res.success({ data: foundUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : returns total number of documents of User.
 * @param {Object} req : request including where object to apply filters in req body
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getUserCount = async (req, res) => {
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
    let countedUser = await dbService.count(User, where);
    return res.success({ data: { count: countedUser } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update document of User with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated User.
 * @return {Object} : updated User. {status, message, data}
 */
const updateUser = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy: req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      userSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    const query = {
      _id: {
        $eq: req.params.id,
        $ne: req.user.id,
      },
    };
    let updatedUser = await dbService.updateOne(User, query, dataToUpdate);
    if (!updatedUser) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const addAdress = async (req, res) => {
  const userId = req.params.userId;
  const newShippingAddress = req.body.newShippingAddress;

  // if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return res.status(400).json({ error: "Invalid user ID" });
  // }

  if (!newShippingAddress || typeof newShippingAddress !== "object") {
    return res.status(400).json({ error: "Invalid new shipping address data" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { shippingAddress: newShippingAddress } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: updatedUser, status: "SUCCESS" });
  } catch (error) {
    console.error(error);
    return res.internalServerError({ message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId;
    // return res.send({ userId, addressId });
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const addressIndex = user?.shippingAddress?.findIndex(
      (address) => address._id == addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: "Address not found" });
    }
    user.shippingAddress[addressIndex].name = req.body.name;
    user.shippingAddress[addressIndex].email = req.body.email;
    user.shippingAddress[addressIndex].phone = req.body.phone;
    user.shippingAddress[addressIndex].phone1 = req.body.phone1;
    user.shippingAddress[addressIndex].address = req.body.address;
    user.shippingAddress[addressIndex].pincode = req.body.pincode;
    user.shippingAddress[addressIndex].landmark = req.body.landmark;
    user.shippingAddress[addressIndex].city = req.body.city;
    user.shippingAddress[addressIndex].district = req.body.district;
    user.shippingAddress[addressIndex].state = req.body.state;

    await user.save();

    return res.success({ data: user });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const addressIndex = user.shippingAddress.findIndex(
      (address) => address._id == addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: "Address not found" });
    }

    user.shippingAddress.splice(addressIndex, 1);

    const newdata = await user.save();

    return res.success({ data: newdata });

    // return res
    //   .status(200)
    //   .json({ message: "Address deleted successfully", user });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const setDefault = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId;

    // Assuming you have some form of authentication and validation here

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the address within the user's shipping addresses
    const addressIndex = user.shippingAddress.findIndex(
      (address) => address.addressNo == addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: "Address not found" });
    }

    // Update isDefault field for the selected address
    user.shippingAddress[addressIndex].isDefault = true;

    // Mark all other addresses as non-default
    user.shippingAddress.forEach((address, index) => {
      if (index !== addressIndex) {
        address.isDefault = false;
      }
    });

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "Default address set successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @description : update multiple records of User with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Users.
 * @return {Object} : updated Users. {status, message, data}
 */
const bulkUpdateUser = async (req, res) => {
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
    let updatedUser = await dbService.updateMany(User, filter, dataToUpdate);
    if (!updatedUser) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: updatedUser } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : partially update document of User with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated User.
 * @return {obj} : updated User. {status, message, data}
 */
const partialUpdateUser = async (req, res) => {
  try {
    if (!req.params.id) {
      res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    // delete req.body["addedBy"];
    // let dataToUpdate = {
    //   ...req.body,
    //   updatedBy: req.user.id,
    // };
    // let validateRequest = validation.validateParamsWithJoi(
    //   dataToUpdate,
    //   userSchemaKey.updateSchemaKeys
    // );
    // if (!validateRequest.isValid) {
    //   return res.validationError({
    //     message: `Invalid values in parameters, ${validateRequest.message}`,
    //   });
    // }
    // const query = {
    //   _id: {
    //     $eq: req.params.id,
    //     $ne: req.user.id,
    //   },
    // };
    // let updatedUser = await dbService.updateOne(User, query, dataToUpdate);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : change password
 * @param {Object} req : request including user credentials.
 * @param {Object} res : response contains updated user document.
 * @return {Object} : updated user document {status, message, data}
 */
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

/**
 * @description : update user profile.
 * @param {Object} req : request including user profile details to update in request body.
 * @param {Object} res : updated user document.
 * @return {Object} : updated user document. {status, message, data}
 */
const updateProfile = async (req, res) => {
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
    delete data.password;
    delete data.createdAt;
    delete data.updatedAt;
    if (data.id) delete data.id;
    let result = await dbService.updateOne(User, { _id: req.user.id }, data, {
      new: true,
    });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
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
  getLoggedInUserInfo,
  addUser,
  bulkInsertUser,
  findAllUser,
  getUser,
  getUserCount,
  updateUser,
  bulkUpdateUser,
  partialUpdateUser,
  changePassword,
  updateProfile,
  addAdress,
  updateAddress,
  deleteAddress,
  setDefault,
};
