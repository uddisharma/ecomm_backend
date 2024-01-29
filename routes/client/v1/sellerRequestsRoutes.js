const express = require("express");
const router = express.Router();
const SellerReqController = require("../../../controller/client/v1/sellerRequestsController");

router.post("/create-request", SellerReqController.createRequest);
router.get("/requests", SellerReqController.allRequests);
router.get("/request/:id", SellerReqController.RequestById);
router.patch("/request/:id", SellerReqController.updateRequest);
router.delete("/request/:id", SellerReqController.deleteRequest);

module.exports = router;
