const passport = require("passport");
const { LOGIN_ACCESS, PLATFORM } = require("../constants/authConstant");

const dbService = require("../utils/dbService");

const verifyCallback =
  (req, resolve, reject, platform) => async (error, user, info) => {
    if (error || info || !user) {
      return reject("Unauthorized User");
    }
    req.user = user;
    if (!user.isActive) {
      return reject("User is deactivated");
    }

    if (user.userType) {
      let allowedPlatforms = LOGIN_ACCESS[user.userType]
        ? LOGIN_ACCESS[user.userType]
        : [];
      if (!allowedPlatforms.includes(platform)) {
        return reject("Unauthorized user");
      }
    }
    resolve();
  };

const auth = (platform) => async (req, res, next) => {
  if (platform == PLATFORM.ADMIN) {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "admin-rule",
        { session: false },
        verifyCallback(req, resolve, reject, platform)
      )(req, res, next);
    })
      .then(() => next())
      .catch((error) => {
        return res.unAuthorized({ message: error.message });
      });
  } else if (platform == PLATFORM.DEVICE) {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "device-rule",
        { session: false },
        verifyCallback(req, resolve, reject, platform)
      )(req, res, next);
    })
      .then(() => next())
      .catch((error) => {
        return res.unAuthorized({ message: error.message });
      });
  } else if (platform == PLATFORM.CLIENT) {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "client-rule",
        { session: false },
        verifyCallback(req, resolve, reject, platform)
      )(req, res, next);
    })
      .then(() => next())
      .catch((error) => {
        return res.unAuthorized({ message: error.message });
      });
  }
};

module.exports = auth;
