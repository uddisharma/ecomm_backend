const express = require("express");
const router = express.Router();
const SellerReqController = require("../../../controller/client/v1/sellerRequestsController");

router.post("/client/create-request", SellerReqController.createRequest);
router.get("/client/requests", SellerReqController.allRequests);
router.get("/client/request/:id", SellerReqController.RequestById);
router.patch("/client/request/:id", SellerReqController.updateRequest);
router.delete("/client/request/:id", SellerReqController.deleteRequest);

module.exports = router;
