/**
 * userRoutes.js
 * @description :: CRUD API routes for user
 */

const express = require("express");
const router = express.Router();
const userController = require("../../../controller/client/v1/userController");
const { PLATFORM } = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");
const checkRolePermission = require("../../../middleware/checkRolePermission");

router
  .route("/client/api/v1/user/me")
  .get(auth(PLATFORM.CLIENT), userController.getLoggedInUserInfo);
router.route("/client/api/v1/user/create").post(userController.addUser);
router
  .route("/client/api/v1/user/list")
  .post(auth(PLATFORM.CLIENT), checkRolePermission, userController.findAllUser);
router
  .route("/client/api/v1/user/count")
  .post(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    userController.getUserCount
  );
router
  .route("/client/api/v1/user/:id")
  .get(auth(PLATFORM.CLIENT), checkRolePermission, userController.getUser);
router
  .route("/client/api/v1/user/update/:id")
  .put(auth(PLATFORM.CLIENT), checkRolePermission, userController.updateUser);

// router
//   .route("/client/api/v1/user/add-address/:id")
//   .put(auth(PLATFORM.CLIENT), checkRolePermission, userController.updateAdress);

router.put("/client/api/v1/user/add-address/:userId", userController.addAdress);

router.put(
  "/client/api/v1/user/update-address/:userId/:addressId",
  userController.updateAddress
);

router.put(
  "/client/api/v1/user/default-address/:userId/:addressId",
  userController.updateAddress
);

router.delete(
  "/client/api/v1/user/delete-address/:userId/:addressId",
  userController.deleteAddress
);

router.patch(
  "/client/api/v1/user/partial-update/:id",
  userController.partialUpdateUser
);

router
  .route("/client/api/v1/user/addBulk")
  .post(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    userController.bulkInsertUser
  );
router
  .route("/client/api/v1/user/updateBulk")
  .put(
    auth(PLATFORM.CLIENT),
    checkRolePermission,
    userController.bulkUpdateUser
  );
router.patch(
  "/client/api/v1/user/change-password/:id",
  userController.changePassword
);
router
  .route("/client/api/v1/user/update-profile")
  .put(auth(PLATFORM.CLIENT), userController.updateProfile);

module.exports = router;
