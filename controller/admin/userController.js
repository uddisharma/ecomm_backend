const User = require("../../model/user");
const userSchemaKey = require("../../utils/validation/userValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const auth = require("../../services/auth");
const deleteDependentService = require("../../utils/deleteDependent");
const CryptoJS = require("crypto-js");

function generateReferralCode(name, email, phoneNumber) {
  const userString = `${name}${email}${phoneNumber}`;

  const hash = CryptoJS.SHA256(userString).toString(CryptoJS.enc.Hex);

  const referralCode = hash.substring(0, 8).toUpperCase();

  return referralCode;
}

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
    dataToCreate.referralCode = generateReferralCode(
      req.body.name,
      req.body.email,
      req.body.mobileNo
    );
    // dataToCreate.addedBy = req.user.id;
    const exist = await User.findOne({ email: req.body.email });
    if (exist) {
      return res.status(200).json({
        status: "EXIST",
        message: "User already exist with this email",
      });
    }
    dataToCreate = new User(dataToCreate);
    let createdUser = await dbService.create(User, dataToCreate);
    return res.success({ data: createdUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllUser = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      select: ["-shippingAddress"],
      sort: "-createdAt",
    };
    const query = {
      isDeleted: req.query.isDeleted,
    };

    let foundUsers = await dbService.paginate(User, query, options);
    if (!foundUsers || !foundUsers.data || !foundUsers.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundUsers });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSingleUser = async (req, res) => {
  const searchTerm = req.query.term;

  try {
    const sellers = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { mobileNo: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("-shippingAddress");
    if (sellers?.length <= 0) {
      return res.recordNotFound();
    }
    return res.success({ data: sellers });
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
      // updatedBy: req.user.id,
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
        // $ne: req.user.id,
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

const softDeleteUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    const query = {
      _id: req.params.id,
      // $ne: req.user.id,
    };
    const updateBody = {
      isDeleted: req.body.isDeleted,
      // updatedBy: req.user.id,
    };
    let updatedUser = await deleteDependentService.softDeleteUser(
      query,
      updateBody
    );
    if (!updatedUser) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete document of User from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted User. {status, message, data}
 */
const deleteUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    const query = {
      _id: {
        $eq: req.params.id,
        // $ne: req.user.id,
      },
    };
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addUser,
  findAllUser,
  getUser,
  getUserCount,
  updateUser,
  softDeleteUser,
  deleteUser,
  findSingleUser,
};
