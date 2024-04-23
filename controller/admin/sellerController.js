const Seller = require("../../model/seller");
const Referral = require("../../model/refferrals");
const User = require("../../model/user");
const Banner = require("../../model/banner");
const userSchemaKey = require("../../utils/validation/userValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");
const deleteDependentService = require("../../utils/deleteDependent");
const Referral_Amount = require("../../constants/referral");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

function ValidateSeller(data) {
  const errors = [];
  if (!data.shopname) errors.push("Shop Name is required");
  if (!data.username) errors.push("Username is required");
  if (!data.cover) errors.push("Cover is required");
  if (!data.email) errors.push("Email is required");
  if (!data.mobileNo) errors.push("Mobile Number is required");
  if (!data.alternatemobileNo)
    errors.push("Alternate Mobile Number is required");
  if (!data.description) errors.push("Description is required");

  if (!data.shopaddress) {
    errors.push("Shop Address is required");
  } else {
    if (!data.shopaddress.pincode)
      errors.push("Pincode is required in Shop Address");
    if (!data.shopaddress.address1)
      errors.push("Address Line 1 is required in Shop Address");
    if (!data.shopaddress.address2)
      errors.push("Address Line 2 is required in Shop Address");
    if (!data.shopaddress.landmark)
      errors.push("Landmark is required in Shop Address");
    if (!data.shopaddress.city) errors.push("City is required in Shop Address");
    if (!data.shopaddress.state)
      errors.push("State is required in Shop Address");
  }

  if (!data.sellingCategory || data.sellingCategory.length === 0)
    errors.push("At least one Selling Category is required");

  if (!data.socialLinks) {
    errors.push("Social Links are required");
  } else {
    if (!data.socialLinks.instagram)
      errors.push("Instagram is required in Social Links");
    if (!data.socialLinks.facebook)
      errors.push("Facebook is required in Social Links");
    if (!data.socialLinks.youtube)
      errors.push("YouTube is required in Social Links");
  }

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
    if (!data.owner) {
      errors.push("Owner Details are required");
    } else {
      if (!data.owner.personal)
        errors.push("Personal Details of the Owner are required");
      if (!data.owner.address)
        errors.push("Address Details of the Owner are required");
      if (!data.owner.personal.name)
        errors.push("Name is required in Owner Personal Details");
      if (!data.owner.personal.phone)
        errors.push("Phone number is required in Owner Personal Details");
      if (!data.owner.personal.email)
        errors.push("Email is required in Owner Personal Details");
      if (!data.owner.address.pincode)
        errors.push("Pincode is required in Owner Address Details");
      if (!data.owner.address.address1)
        errors.push("Address Line 1 is required in Owner Address Details");
      if (!data.owner.address.address2)
        errors.push("Address Line 2 is required in Owner Address Details");
      if (!data.owner.address.landmark)
        errors.push("Landmark is required in Owner Address Details");
      if (!data.owner.address.city)
        errors.push("City is required in Owner Address Details");
      if (!data.owner.address.state)
        errors.push("State is required in Owner Address Details");
      if (!data.owner.signature) {
        errors.push("Signature is required in Owner Details");
      }
    }
  }

  if (
    !data.legal ||
    !data.legal.aadhar ||
    !data.legal.pan ||
    !data.legal.bank ||
    !data.legal.certificate ||
    data.legal.certificate.length < 3 ||
    !data.legal.signed
  ) {
    if (!data.legal) {
      errors.push("Legal Details are required");
    } else {
      if (!data.legal.aadhar) {
        errors.push("Aadhar Details are required in Legal Documents");
      } else {
        if (!data.legal.aadhar.name)
          errors.push("Name is required in Aadhar Details");
        if (!data.legal.aadhar.address)
          errors.push("Address is required in Aadhar Details");
        if (!data.legal.aadhar.careof)
          errors.push("Care of is required in Aadhar Details");
        if (!data.legal.aadhar.aadharnumber)
          errors.push("Aadhar Number is required in Aadhar Details");
        if (!data.legal.aadhar.signed)
          errors.push("Aadhar Details must be signed");
      }

      if (!data.legal.pan) {
        errors.push("PAN Details are required in Legal Documents");
      } else {
        if (!data.legal.pan.name)
          errors.push("Name is required in PAN Details");
        if (!data.legal.pan.type)
          errors.push("Type is required in PAN Details");
        if (!data.legal.pan.pannumber)
          errors.push("PAN Number is required in PAN Details");
        if (!data.legal.pan.signed) errors.push("PAN Details must be signed");
      }

      if (!data.legal.bank) {
        errors.push("Bank Details are required in Legal Documents");
      } else {
        if (!data.legal.bank.name)
          errors.push("Name is required in Bank Details");
        if (!data.legal.bank.branch)
          errors.push("Branch is required in Bank Details");
        if (!data.legal.bank.account)
          errors.push("Account Number is required in Bank Details");
        if (!data.legal.bank.ifsc)
          errors.push("IFSC Code is required in Bank Details");
        if (!data.legal.bank.signed) errors.push("Bank Details must be signed");
      }

      if (!data.legal.certificate || data.legal.certificate.length < 3) {
        errors.push("Legal certificates must have at least 3 certificates");
      }

      if (!data.legal.signed) {
        errors.push("Legal Documents must be signed");
      }
    }
  }

  if (
    !data.deliverypartner ||
    !data.deliverypartner.personal ||
    data.deliverypartner.personal.have === undefined ||
    (data.deliverypartner.personal.have &&
      !data.deliverypartner.personal.name &&
      !data.deliverypartner.personal.rate) ||
    !data.deliverypartner.partner ||
    !data.deliverypartner.partner.email ||
    !data.deliverypartner.partner.password ||
    !data.deliverypartner.partner.warehouses ||
    data.deliverypartner.partner.warehouses.length === 0
  ) {
    if (!data.deliverypartner) {
      errors.push("Delivery Partner Details are required");
    } else {
      if (!data.deliverypartner.personal) {
        errors.push("Personal Details of the Delivery Partner are required");
      } else {
        if (data.deliverypartner.personal.have === undefined) {
          errors.push(
            "Have is required in Personal Details of the Delivery Partner"
          );
        }
        if (
          data.deliverypartner.personal.have &&
          !data.deliverypartner.personal.name &&
          !data.deliverypartner.personal.rate
        ) {
          errors.push(
            "Name or Rate is required in Personal Details of the Delivery Partner"
          );
        }
      }

      if (!data.deliverypartner.partner) {
        errors.push("Partner Details are required");
      } else {
        if (!data.deliverypartner.partner.email)
          errors.push("Email is required in Partner Details");
        if (!data.deliverypartner.partner.password)
          errors.push("Password is required in Partner Details");
        if (
          !data.deliverypartner.partner.warehouses ||
          data.deliverypartner.partner.warehouses.length === 0
        ) {
          errors.push("At least one Warehouse is required in Partner Details");
        } else {
          for (
            let i = 0;
            i < data.deliverypartner.partner.warehouses.length;
            i++
          ) {
            const warehouse = data.deliverypartner.partner.warehouses[i];
            if (!warehouse.warehouse_name)
              errors.push(`Warehouse name is required in Warehouse ${i + 1}`);
            if (!warehouse.name)
              errors.push(`Name is required in Warehouse ${i + 1}`);
            if (!warehouse.address)
              errors.push(`Address is required in Warehouse ${i + 1}`);
            if (!warehouse.address_2)
              errors.push(`Address Line 2 is required in Warehouse ${i + 1}`);
            if (!warehouse.city)
              errors.push(`City is required in Warehouse ${i + 1}`);
            if (!warehouse.state)
              errors.push(`State is required in Warehouse ${i + 1}`);
            if (!warehouse.pincode)
              errors.push(`Pincode is required in Warehouse ${i + 1}`);
            if (!warehouse.phone)
              errors.push(`Phone is required in Warehouse ${i + 1}`);
            if (warehouse.default === undefined)
              errors.push(`Default status is required in Warehouse ${i + 1}`);
          }
        }
      }
    }
  }

  if (!data.rating || !data.rating.rate || !data.rating.total) {
    if (!data.rating) {
      errors.push("Rating Details are required");
    } else {
      if (!data.rating.rate) errors.push("Rate is required in Rating Details");
      if (!data.rating.total)
        errors.push("Total is required in Rating Details");
    }
  }

  if (!data.charge) errors.push("Charge is required");

  if (data.isDeleted == true) errors.push("Seller is Deleted ");

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: null };
}

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
      checkReferralCode = await User.findOne({
        referralCode: referral_code,
      });
      checkReferralCode = checkReferralCode?._id;
    }
    if (checkReferralCode) {
      dataToCreate.referredBy = checkReferralCode;
    }
    dataToCreate = new Seller(dataToCreate);

    let createdUser = await dbService.create(Seller, dataToCreate);

    const findReferral = await Referral.findOne({
      referredSeller: createdUser?._id,
      referringUser: checkReferralCode,
    });

    if (!findReferral) {
      const newReferral = new Referral({
        referredSeller: createdUser?._id,
        referringUser: checkReferralCode,
      });
      await newReferral.save();
      // myCache.del("getAllReferralsofUseradmin");
      // myCache.del("getAllReferralsadmin");
      // myCache.del("userreferralsclient");
    }

    return res.success({ data: createdUser });
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
      select: [
        "-legal",
        "-deliverypartner",
        "-resetPasswordLink",
        "-owner",
        "-charge",
      ],
    };
    let query = { isDeleted: false, isOnboarded: true };
    // const chachedseller = myCache.get("findAllSellersadmin");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    // myCache.set("findAllSellersadmin", JSON.stringify(foundSellers), 21600);
    return res.success({ data: foundSellers });
    // }
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

    // const chachedseller = myCache.get("findAllSellersWithPendingOnboarding");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    // myCache.set(
    //   "findAllSellersWithPendingOnboarding",
    //   JSON.stringify(foundSellers),
    //   21600
    // );
    return res.success({ data: foundSellers });
    // }
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

    // const chachedseller = myCache.get("findAllSellersWithDeleted");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
    let foundSellers = await dbService.paginate(Seller, query, options);
    if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
      return res.recordNotFound();
    }
    // myCache.set(
    //   "findAllSellersWithDeleted",
    //   JSON.stringify(foundSellers),
    //   21600
    // );
    return res.success({ data: foundSellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSingleSeller = async (req, res) => {
  const searchTerm = req.query.term;
  try {
    // const chachedseller = myCache.get("findSingleSelleradmin");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
    const sellers = await Seller.find({
      $or: [
        { shopname: { $regex: searchTerm, $options: "i" } },
        { username: { $regex: searchTerm, $options: "i" } },
      ],
      isDeleted: false,
    }).select("shopname username isOnboarded isActive isDeleted");
    if (sellers?.length <= 0) {
      return res.recordNotFound();
    }
    // myCache.set("findSingleSelleradmin", JSON.stringify(sellers), 21600);
    return res.success({ data: sellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSingleSellerWithPendingOnboarding = async (req, res) => {
  const searchTerm = req.query.term;

  try {
    // const chachedseller = myCache.get("findSingleSellerWithPendingOnboarding");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
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
    // myCache.set(
    //   "findSingleSellerWithPendingOnboarding",
    //   JSON.stringify(sellers),
    //   21600
    // );
    return res.success({ data: sellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSingleSellerWithdeleted = async (req, res) => {
  const searchTerm = req.query.term;

  try {
    // const chachedseller = myCache.get("findSingleSellerWithdeleted");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
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
    // myCache.set(
    //   "findSingleSellerWithdeleted",
    //   JSON.stringify(sellers),
    //   21600
    // );
    return res.success({ data: sellers });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getSellingCategoryofSeller = async (req, res) => {
  try {
    // const chachedseller = myCache.get("getSellingCategoryofSelleradmin");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
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

    if (!seller || !seller.sellingCategory) {
      return res.notFound({
        message: "Seller or selling category not found",
      });
    }
    // myCache.set(
    //   "getSellingCategoryofSelleradmin",
    //   JSON.stringify(seller),
    //   21600
    // );
    return res.success({ data: seller });
    // }
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
    // myCache.del("findAllSellersadmin");
    // myCache.del("findAllSellersWithPendingOnboarding");
    // myCache.del("findAllSellersWithDeleted");
    // myCache.del("findSingleSelleradmin");
    // myCache.del("findSingleSellerWithPendingOnboarding");
    // myCache.del("findSingleSellerWithdeleted");
    // myCache.del("getSellingCategoryofSelleradmin");
    // myCache.del("getSelleradmin");
    // myCache.del("getSellerCountadmin");

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
    // const chachedseller = myCache.get("getSelleradmin");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
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
      .populate({
        path: "referredBy",
        select: ["name", "email"],
      })
      .select("-resetPasswordLink -password");
    if (user) {
      // myCache.set("getSelleradmin", JSON.stringify(user), 21600);
      return res.success({
        data: { user },
      });
    } else {
      return res.recordNotFound();
    }
    // }
  } catch (error) {
    console.log(error);
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
    // const chachedseller = myCache.get("getSellerCountadmin");

    // if (chachedseller) {
    //   return res.success({ data: JSON.parse(chachedseller) });
    // } else {
    let countedUser = await dbService.count(Seller, where);
    // myCache.set("getSellerCountadmin", JSON.stringify(countedUser), 21600);
    return res.success({ data: { count: countedUser } });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const updateSeller = async (req, res) => {
  try {
    let dataToUpdate = { ...req.body };
    if (dataToUpdate.isOnboarded) {
      delete dataToUpdate.isOnboarded;
    }

    let updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      dataToUpdate,
      { new: true }
    );

    if (!updatedSeller) {
      return res.recordNotFound();
    }
    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("findAllSellersClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");
    // myCache.del("findAllSellersadmin");
    // myCache.del("findAllSellersWithPendingOnboarding");
    // myCache.del("findAllSellersWithDeleted");
    // myCache.del("findSingleSelleradmin");
    // myCache.del("findSingleSellerWithPendingOnboarding");
    // myCache.del("findSingleSellerWithdeleted");
    // myCache.del("getSellingCategoryofSelleradmin");
    // myCache.del("getSelleradmin");
    // myCache.del("getSellerCountadmin");
    return res.success({ data: updatedSeller });
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
    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("findAllSellersClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");
    // myCache.del("findAllSellersadmin");
    // myCache.del("findAllSellersWithPendingOnboarding");
    // myCache.del("findAllSellersWithDeleted");
    // myCache.del("findSingleSelleradmin");
    // myCache.del("findSingleSellerWithPendingOnboarding");
    // myCache.del("findSingleSellerWithdeleted");
    // myCache.del("getSellingCategoryofSelleradmin");
    // myCache.del("getSelleradmin");
    // myCache.del("getSellerCountadmin");
    return res.success({ data: deletedSeller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteSeller1 = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("findAllSellersClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");
    // myCache.del("findAllSellersadmin");
    // myCache.del("findAllSellersWithPendingOnboarding");
    // myCache.del("findAllSellersWithDeleted");
    // myCache.del("findSingleSelleradmin");
    // myCache.del("findSingleSellerWithPendingOnboarding");
    // myCache.del("findSingleSellerWithdeleted");
    // myCache.del("getSellingCategoryofSelleradmin");
    // myCache.del("getSelleradmin");
    // myCache.del("getSellerCountadmin");
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
    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("findAllSellersClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");
    // myCache.del("findAllSellersadmin");
    // myCache.del("findAllSellersWithPendingOnboarding");
    // myCache.del("findAllSellersWithDeleted");
    // myCache.del("findSingleSelleradmin");
    // myCache.del("findSingleSellerWithPendingOnboarding");
    // myCache.del("findSingleSellerWithdeleted");
    // myCache.del("getSellingCategoryofSelleradmin");
    // myCache.del("getSelleradmin");
    // myCache.del("getSellerCountadmin");
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

const addCategory = async (req, res) => {
  try {
    const { category, photo, sellerId } = req.body;

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
    // myCache.del("findAllSellersadmin");
    // myCache.del("findAllSellersWithPendingOnboarding");
    // myCache.del("findAllSellersWithDeleted");
    // myCache.del("findSingleSelleradmin");
    // myCache.del("findSingleSellerWithPendingOnboarding");
    // myCache.del("findSingleSellerWithdeleted");
    // myCache.del("getSellingCategoryofSelleradmin");
    // myCache.del("getSelleradmin");
    // myCache.del("getSellerCountadmin");
    return res.success({ data: "success" });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const finalOnboardSeller = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
    };

    const { valid, errors } = ValidateSeller(dataToUpdate);

    if (!valid) {
      return res.json({ valid, errors });
    }

    const sellerBanners = await Banner.find({ sellerId: req.params.id });

    if (sellerBanners?.length <= 0) {
      return res.json({
        valid: false,
        errors: ["Please add atleast one banner"],
      });
    }

    let updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        isOnboarded: true,
        onboardAt: new Date(),
        // createdAt: new Date(),
      },
      { new: true }
    );
    if (!updatedSeller) {
      return res.recordNotFound();
    }

    if (updatedSeller?.referredBy) {
      const findReferral = await Referral.findOne({
        referredSeller: req.params.id,
        referringUser: updatedSeller?.referredBy,
      });

      if (!findReferral?.onboarded || !findReferral?.status) {
        await Referral.findOneAndUpdate(
          {
            referredSeller: req.params.id,
            referringUser: updatedSeller?.referredBy,
          },
          {
            $set: {
              referredSeller: req.params.id,
              referringUser: updatedSeller?.referredBy,
              amount:
                findReferral?.amount > 0
                  ? findReferral?.amount
                  : Referral_Amount,
              onboarded: true,
            },
          },
          {
            new: true,
          }
        );
      }

      if (!findReferral) {
        const newReferral = new Referral({
          referredSeller: req.params.id,
          referringUser: updatedSeller?.referredBy,
          amount: Referral_Amount,
          onboarded: true,
        });
        await newReferral.save();
        // myCache.del("getAllReferralsofUseradmin");
        // myCache.del("getAllReferralsadmin");
        // myCache.del("userreferralsclient");
      }
    }
    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("findAllSellersClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");
    // myCache.del("findAllSellersadmin");
    // myCache.del("findAllSellersWithPendingOnboarding");
    // myCache.del("findAllSellersWithDeleted");
    // myCache.del("findSingleSelleradmin");
    // myCache.del("findSingleSellerWithPendingOnboarding");
    // myCache.del("findSingleSellerWithdeleted");
    // myCache.del("getSellingCategoryofSelleradmin");
    // myCache.del("getSelleradmin");
    // myCache.del("getSellerCountadmin");
    return res.success({ data: updatedSeller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const unOnboardSeller = async (req, res) => {
  try {
    let updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        isOnboarded: false,
      },
      { new: true }
    );
    if (!updatedSeller) {
      return res.recordNotFound();
    }
    // myCache.del("findAllSellersWithCategoryClient");
    // myCache.del("findAllSellersClient");
    // myCache.del("getSellingCategoryofSellerClient");
    // myCache.del("searchSellerclient");
    // myCache.del("sellerByIdseller");
    // myCache.del("findAllSellersadmin");
    // myCache.del("findAllSellersWithPendingOnboarding");
    // myCache.del("findAllSellersWithDeleted");
    // myCache.del("findSingleSelleradmin");
    // myCache.del("findSingleSellerWithPendingOnboarding");
    // myCache.del("findSingleSellerWithdeleted");
    // myCache.del("getSellingCategoryofSelleradmin");
    // myCache.del("getSelleradmin");
    // myCache.del("getSellerCountadmin");
    return res.success({ data: updatedSeller });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addSeller,
  findAllSellers,
  getSeller,
  getSellerCount,
  updateSeller,
  deleteSeller1,
  updateSellerProfile,
  getSellingCategoryofSeller,
  findSingleSeller,
  deleteCategory,
  findAllSellersWithPendingOnboarding,
  findSingleSellerWithPendingOnboarding,
  findAllSellersWithDeleted,
  findSingleSellerWithdeleted,
  deleteSeller,
  addCategory,
  finalOnboardSeller,
  unOnboardSeller,
};
