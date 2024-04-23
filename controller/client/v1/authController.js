const User = require("../../../model/user");
const dbService = require("../../../utils/dbService");
const dayjs = require("dayjs");
const userSchemaKey = require("../../../utils/validation/userValidation");
const validation = require("../../../utils/validateRequest");
const authConstant = require("../../../constants/authConstant");
const authService = require("../../../services/auth");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { JWT } = require("../../../constants/authConstant");
const bcrypt = require("bcrypt");

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

const register = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }

    function generateReferralCode1(name, email, phoneNumber) {
      const userString = `${name}${email}${phoneNumber}`;

      const hash = CryptoJS.SHA256(userString).toString(CryptoJS.enc.Hex);

      const referralCode = hash.substring(0, 10).toUpperCase();

      return referralCode;
    }

    const data = new User({
      ...req.body,
      referralCode: generateReferralCode1(
        req.body.name,
        req.body.email,
        req.body.mobileNo
      ),
      userType: authConstant.USER_TYPES.User,
    });

    const dataexist = await User.findOne({ email: data.email });
    if (dataexist) {
      return res.send({
        status: "EXIST",
        message: `${data.email} already exists.`,
      });
    }
    const result = await dbService.create(User, data);

    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ data: error.message });
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
    let roleAccess = false;

    if (req.body.includeRoleAccess) {
      roleAccess = req.body.includeRoleAccess;
    }

    const user = await User.findOne({ email: req.body.username }).select([
      "-loginRetryLimit",
      "-isDeleted",
      "-resetPasswordLink",
      "-userType",
    ]);
    if (user?.isDeleted) {
      return res.json({ message: "blocked" });
    }
    if (user) {
      const matched = await user.isPasswordMatch(password);
      if (matched) {
        const userData = user.toJSON();
        const token = await generateToken(
          userData,
          authConstant.JWT.CLIENT_SECRET
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

const forgotPassword = async (req, res) => {
  const params = req.body;
  try {
    if (!params.email) {
      return res.badRequest({
        message: "Insufficient request parameters! email is required.",
      });
    }
    let where = { email: params.email };
    where.isActive = true;
    where.isDeleted = false;
    params.email = params.email.toString().toLowerCase();
    let found = await dbService.findOne(User, where);
    if (!found) {
      return res.recordNotFound();
    }
    let { resultOfEmail, resultOfSMS } =
      await authService.sendResetPasswordNotification(found);
    if (resultOfEmail && resultOfSMS) {
      return res.success({ message: "otp successfully send." });
    } else if (resultOfEmail && !resultOfSMS) {
      return res.success({ message: "otp successfully send to your email." });
    } else if (!resultOfEmail && resultOfSMS) {
      return res.success({
        message: "otp successfully send to your mobile number.",
      });
    } else {
      return res.failure({
        message: "otp can not be sent due to some issue try again later",
      });
    }
  } catch (error) {
    return res.internalServerError({ data: error.message });
  }
};

const resetPassword = async (req, res) => {
  const params = req.body;
  try {
    if (!params.code || !params.newPassword) {
      return res.badRequest({
        message:
          "Insufficient request parameters! code and newPassword is required.",
      });
    }
    const where = {
      "resetPasswordLink.code": params.code,
      isActive: true,
      isDeleted: false,
    };
    let found = await dbService.findOne(User, where);
    if (!found || !found.resetPasswordLink.expireTime) {
      return res.failure({ message: "Invalid Code" });
    }
    if (dayjs(new Date()).isAfter(dayjs(found.resetPasswordLink.expireTime))) {
      return res.failure({
        message: "Your reset password link is expired or invalid",
      });
    }

    let response = await authService.resetPassword(found, params.newPassword);
    if (!response || response.flag) {
      return res.failure({ message: response.data });
    }
    return res.success({ message: response.data });
  } catch (error) {
    return res.internalServerError({ data: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
