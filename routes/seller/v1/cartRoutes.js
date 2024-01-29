/**
 * cartRoutes.js
 * @description :: CRUD API routes for cart
 */

const express = require('express');
const router = express.Router();
const cartController = require('../../../controller/seller/v1/cartController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/seller/api/v1/cart/create').post(auth(PLATFORM.DEVICE),checkRolePermission,cartController.addCart);
router.route('/seller/api/v1/cart/list').post(auth(PLATFORM.DEVICE),checkRolePermission,cartController.findAllCart);
router.route('/seller/api/v1/cart/count').post(auth(PLATFORM.DEVICE),checkRolePermission,cartController.getCartCount);
router.route('/seller/api/v1/cart/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,cartController.getCart);
router.route('/seller/api/v1/cart/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,cartController.updateCart);    
router.route('/seller/api/v1/cart/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,cartController.partialUpdateCart);
router.route('/seller/api/v1/cart/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,cartController.softDeleteCart);
router.route('/seller/api/v1/cart/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,cartController.softDeleteManyCart);
router.route('/seller/api/v1/cart/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,cartController.bulkInsertCart);
router.route('/seller/api/v1/cart/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,cartController.bulkUpdateCart);
router.route('/seller/api/v1/cart/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,cartController.deleteCart);
router.route('/seller/api/v1/cart/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,cartController.deleteManyCart);

module.exports = router;
