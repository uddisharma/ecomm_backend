const express = require("express");
const router = express.Router();
const userController = require("../../controller/admin/userController");
const { PLATFORM } = require("../../constants/authConstant");
const auth = require("../../middleware/auth");
const checkRolePermission = require("../../middleware/checkRolePermission");
const authenticateJWT = require("../../middleware/loginUser");

router
  .route("/admin/user/create")
  .post(authenticateJWT(PLATFORM.ADMIN), userController.addUser);

router
  .route("/admin/user/list")
  .get(authenticateJWT(PLATFORM.ADMIN), userController.findAllUser);

router
  .route("/admin/user/count")
  .post(
    authenticateJWT(PLATFORM.ADMIN),
    checkRolePermission,
    userController.getUserCount
  );

router
  .route("/admin/singleuser/:id")
  .get(authenticateJWT(PLATFORM.ADMIN), userController.getUser);

router
  .route("/admin/user/update/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), userController.updateUser);

router
  .route("/admin/user/softDelete/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), userController.softDeleteUser);

router
  .route("/admin/user/delete/:id")
  .delete(authenticateJWT(PLATFORM.ADMIN), userController.deleteUser);

router
  .route("/admin/user/find/queryuser")
  .get(authenticateJWT(PLATFORM.ADMIN), userController?.findSingleUser);

module.exports = router;
