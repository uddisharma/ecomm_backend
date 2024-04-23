const express = require("express");
const router = express.Router();
const SellerReqController = require("../../../controller/client/v1/sellerRequestsController");

router.post("/client/create-request", SellerReqController.createRequest);


module.exports = router;
