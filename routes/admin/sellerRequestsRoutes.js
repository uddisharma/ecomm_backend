const express = require("express");
const router = express.Router();
const SellerReqController = require("../../controller/admin/sellerRequestsController");
const authenticateJWT = require("../../middleware/loginUser");
const { PLATFORM } = require("../../constants/authConstant");

router.post("/admin/create-request", SellerReqController.createRequest);
router.get(
  "/admin/requests",
  authenticateJWT(PLATFORM.ADMIN),
  SellerReqController.allRequests
);
router.get(
  "/admin/request/:id",
  authenticateJWT(PLATFORM.ADMIN),
  SellerReqController.RequestById
);
router.patch(
  "/admin/request/:id",
  authenticateJWT(PLATFORM.ADMIN),
  SellerReqController.updateRequest
);
router.delete(
  "/admin/request/:id",
  authenticateJWT(PLATFORM.ADMIN),
  SellerReqController.deleteRequest
);

module.exports = router;
