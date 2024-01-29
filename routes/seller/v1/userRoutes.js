/**
 * userRoutes.js
 * @description :: CRUD API routes for user
 */

const express = require('express');
const router = express.Router();
const userController = require('../../../controller/seller/v1/userController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/seller/api/v1/user/me').get(auth(PLATFORM.DEVICE),userController.getLoggedInUserInfo);
router.route('/seller/api/v1/user/create').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.addUser);
router.route('/seller/api/v1/user/list').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.findAllUser);
router.route('/seller/api/v1/user/count').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.getUserCount);
router.route('/seller/api/v1/user/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,userController.getUser);
router.route('/seller/api/v1/user/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,userController.updateUser);    
router.route('/seller/api/v1/user/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,userController.partialUpdateUser);
router.route('/seller/api/v1/user/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.bulkInsertUser);
router.route('/seller/api/v1/user/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,userController.bulkUpdateUser);
router.route('/seller/api/v1/user/change-password').put(auth(PLATFORM.DEVICE),userController.changePassword);
router.route('/seller/api/v1/user/update-profile').put(auth(PLATFORM.DEVICE),userController.updateProfile);

module.exports = router;
