const Seller = require("../../../model/seller");
const Referral = require("../../../model/refferrals");
const User = require("../../../model/user");
const dbService = require("../../../utils/dbService");
const auth = require("../../../services/sellerauth");
const userSchemaKey = require("../../../utils/validation/userValidation");
const validation = require("../../../utils/validateRequest");
const { JWT } = require("../../../constants/authConstant");
const authConstant = require("../../../constants/authConstant");
const jwt = require("jsonwebtoken");
const Referral_Amount = require("../../../constants/referral");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const generateToken = async (user, secret) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.email,
    },
    secret,
    { expiresIn: JWT.EXPIRES_IN * 60 }
  );
};

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
    const { referral_code } = dataToCreate;

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
    let checkReferralCode;
    if (referral_code) {
      console.log("yes code");
      checkReferralCode = await User.findOne({
        referralCode: referral_code,
      });
      checkReferralCode = checkReferralCode?._id;
    }

    if (checkReferralCode) {
      dataToCreate.referredBy = checkReferralCode;
    }

    // dataToCreate = new Seller(dataToCreate);

    let createdUser = await dbService.create(Seller, dataToCreate);

    let findReferral;

    if (checkReferralCode) {
      findReferral = await Referral.findOne({
        referredSeller: createdUser?._id,
        referringUser: checkReferralCode,
      });
    }

    if (!findReferral && referral_code) {
      const newReferral = new Referral({
        referredSeller: createdUser?._id,
        referringUser: checkReferralCode,
        amount: Referral_Amount,
      });
      await newReferral.save();
    }

    return res.success({ data: createdUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.badRequest({
        message:
          "Insufficient request parameters! username and password is required.",
      });
    }
    if (req.body.includeRoleAccess) {
      roleAccess = req.body.includeRoleAccess;
    }
    const user = await Seller.findOne({
      email: req.body.username,
    }).populate({
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

    if (user) {
      const matched = await user.isPasswordMatch(password);
      if (matched) {
        const userData = user.toJSON();
        const token = await generateToken(
          userData,
          authConstant.JWT.DEVICE_SECRET
        );
        return res.success({
          data: { ...userData, token },
          message: "Login Successful",
        });
      } else {
        res.json({ message: "wrong password" });
      }
    } else {
      res.json({ message: "user not found" });
    }
  } catch (error) {
    return res.internalServerError({ data: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { category, photo } = req.body;
    const sellerId = req.user.id;

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

    const newSellingCategory = {
      category,
      photo,
    };

    existingShop.sellingCategory.push(newSellingCategory);
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

    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("findAllSellersClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");

    return res.success({ data: seller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const sellerId = req.user.id;
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

    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");
    // myCache.del("findAllSellersClient");

    return res.success({ data: seller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateSeller = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
    };
    const query = {
      _id: {
        $eq: req.user.id,
      },
    };
    let updatedSeller = await dbService.updateOne(Seller, query, dataToUpdate);
    if (!updatedSeller) {
      return res.recordNotFound();
    }
    const seller = await Seller.findById(req.user.id).populate({
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
    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");
    // myCache.del("findAllSellersClient");
    return res.success({ data: seller });
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

const sellerById = async (req, res) => {
  try {
    // const chachedseller = myCache.get("sellerByIdseller");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
    const data = await Seller.findById(req.params?.id);
    // myCache.set("sellerByIdseller", JSON.stringify(data), 3600);
    res.send(data);
    // }
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  addSeller,
  updateSeller,
  sellerById,
  addCategory,
  deleteCategory,
  changePassword,
  login,
};
