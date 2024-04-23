/**
 * index.js
 * @description :: index route file of client platform.
 */

const express = require("express");
const router = express.Router();
router.use("/client/auth", require("./auth"));
router.use(require("./userRoutes"));
router.use(require("./productRoutes"));
router.use(require("./orderRoutes"));
router.use(require("./couponRoutes"));
router.use(require("./bannerRoutes"));
router.use(require("./shiprocket"));
router.use(require("./sellerRoutes"));
router.use(require("./nimBusRoutes"));
router.use(require("./referralRoutes"));
router.use(require("./sellerRequestsRoutes"));
router.use(require("./contactRoutes"));

module.exports = router;
