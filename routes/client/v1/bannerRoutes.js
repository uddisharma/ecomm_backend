const express = require("express");
const router = express.Router();
const bannerController = require("../../../controller/client/v1/bannerController");

router
  .route("/client/seller/banner/list/:username")
  .get(bannerController.findSellerAllBanner);

module.exports = router;
