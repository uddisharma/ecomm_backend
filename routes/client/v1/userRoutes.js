const express = require("express");
const router = express.Router();
const userController = require("../../../controller/client/v1/userController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router
  .route("/client/api/v1/user/me")
  .get(authenticateJWT(PLATFORM.CLIENT), userController.getLoggedInUserInfo);

router.put(
  "/client/api/v1/user/add-address",
  authenticateJWT(PLATFORM.CLIENT),
  userController.addAdress
);

router.put(
  "/client/api/v1/user/update-address/:addressId",
  authenticateJWT(PLATFORM.CLIENT),
  userController.updateAddress
);

router.put(
  "/client/api/v1/user/default-address/:userId/:addressId",
  authenticateJWT(PLATFORM.CLIENT),
  userController.updateAddress
);

router.delete(
  "/client/api/v1/user/delete-address/:userId/:addressId",
  authenticateJWT(PLATFORM.CLIENT),
  userController.deleteAddress
);

router.patch(
  "/client/api/v1/user/change-password",
  authenticateJWT(PLATFORM.CLIENT),
  userController.changePassword
);

router
  .route("/client/api/v1/user/update-profile")
  .put(authenticateJWT(PLATFORM.CLIENT), userController.updateProfile);

router.patch(
  "/client/api/v1/user/partial-update",
  authenticateJWT(PLATFORM.CLIENT),
  userController.partialUpdateUser
);

module.exports = router;
