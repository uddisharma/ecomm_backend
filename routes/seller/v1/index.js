/**
 * index.js
 * @description :: index route file of device platform.
 */

const express = require("express");
const router = express.Router();
router.use("/seller/auth", require("./auth"));
router.use(require("./productRoutes"));
router.use(require("./bannerRoutes"));
router.use(require("./couponRoutes"));
router.use(require("./orderRoutes"));
router.use(require("./transactionRoutes"));
router.use(require("./uploadRoutes"));
router.use(require("./sellerRoutes"));
router.use(require("./couponRoutes"));
router.use(require("./ticketsRoutes"));
router.use(require("./uploadRoutes1"));

module.exports = router;
