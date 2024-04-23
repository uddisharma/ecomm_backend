const mongoose = require("mongoose");

const checkRolePermission = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.badRequest();
  }

  if (rolesOfUser && rolesOfUser.length) {
    rolesOfUser = rolesOfUser.map((role) =>
      mongoose.Types.ObjectId(role.roleId)
    );

    if (route) {
      if (allowedRoute && allowedRoute.length) {
        next();
      } else {
        return res.unAuthorized();
      }
    } else {
      return res.unAuthorized();
    }
  } else {
    // return res.unAuthorized();
    next();
  }
};

module.exports = checkRolePermission;
