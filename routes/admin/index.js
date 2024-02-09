/**
 * index.js
 * @description :: index route file of admin platform.
 */

const express = require("express");
const router = express.Router();
router.use("/admin/auth", require("./auth"));
router.use(require("./userRoutes"));
router.use(require("./productRoutes"));
router.use(require("./categoryRoutes"));
router.use(require("./orderRoutes"));
router.use(require("./bannerRoutes"));
router.use(require("./cartRoutes"));
router.use(require("./countryRoutes"));
router.use(require("./cityRoutes"));
router.use(require("./pincodeRoutes"));
router.use(require("./stateRoutes"));
router.use(require("./walletRoutes"));
router.use(require("./walletTransactionRoutes"));
router.use(require("./shippingRoutes"));
router.use(require("./roleRoutes"));
router.use(require("./projectRouteRoutes"));
router.use(require("./routeRoleRoutes"));
router.use(require("./userRoleRoutes"));
router.use(require("./uploadRoutes"));
router.use(require("./delhiveryRoutes"));
router.use(require("./sellerRoutes"));
router.use(require("./nimBusRoutes"));
router.use(require("./couponRoutes"));
router.use(require("./transactionRoutes"));
router.use(require("./ticketsRoutes"));
router.use(require("./sellerRequestsRoutes"));
router.use(require("./contactRoutes"));

module.exports = router;
