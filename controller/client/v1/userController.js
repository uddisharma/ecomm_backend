const User = require("../../../model/user");
const userSchemaKey = require("../../../utils/validation/userValidation");
const validation = require("../../../utils/validateRequest");
const dbService = require("../../../utils/dbService");
const auth = require("../../../services/auth");

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

const addAdress = async (req, res) => {
  const userId = req.user.id;
  const newShippingAddress = req.body.newShippingAddress;

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
    const userId = req.user.id;
    const addressId = req.params.addressId;
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
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const setDefault = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const addressIndex = user.shippingAddress.findIndex(
      (address) => address.addressNo == addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: "Address not found" });
    }

    user.shippingAddress[addressIndex].isDefault = true;

    user.shippingAddress.forEach((address, index) => {
      if (index !== addressIndex) {
        address.isDefault = false;
      }
    });

    await user.save();

    return res
      .status(200)
      .json({ message: "Default address set successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
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
      userId: req.user.id,
    });
    if (result.flag) {
      return res.failure({ message: result.data });
    }
    return res.success({ message: result.data });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

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

const partialUpdateUser = async (req, res) => {
  try {
    if (!req.user.id) {
      res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
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

module.exports = {
  partialUpdateUser,
  getLoggedInUserInfo,
  changePassword,
  updateProfile,
  addAdress,
  updateAddress,
  deleteAddress,
  setDefault,
};
