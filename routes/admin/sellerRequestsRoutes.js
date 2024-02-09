const express = require("express");
const router = express.Router();
const SellerReqController = require("../../controller/admin/sellerRequestsController");

router.post("/admin/create-request", SellerReqController.createRequest);
router.get("/admin/requests", SellerReqController.allRequests);
router.get("/admin/request/:id", SellerReqController.RequestById);
router.patch("/admin/request/:id", SellerReqController.updateRequest);
router.delete("/admin/request/:id", SellerReqController.deleteRequest);

module.exports = router;
