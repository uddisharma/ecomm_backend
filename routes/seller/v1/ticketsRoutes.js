const express = require("express");
const router = express.Router();
const ticketController = require("../../../controller/seller/v1/ticketsController");
const { PLATFORM } = require("../../../constants/authConstant");
const authenticateJWT = require("../../../middleware/loginUser");

router.post(
  "/seller/vi/seller/ticket/create",
  authenticateJWT(PLATFORM.DEVICE),
  ticketController.addTicket
);

router
  .route("/seller/vi/seller/tickets")
  .get(authenticateJWT(PLATFORM.DEVICE), ticketController.getSellerTickets);

router.patch(
  "/seller/vi/seller/ticket/reply",
  authenticateJWT(PLATFORM.DEVICE),
  ticketController.ticketReply
);

router
  .route("/seller/vi/seller/mark/resolved/:ticketId")
  .patch(authenticateJWT(PLATFORM.DEVICE), ticketController.markAsResolved);

router
  .route("/seller/vi/seller/single/ticket/:id")
  .get(authenticateJWT(PLATFORM.DEVICE), ticketController?.getSingleTicket);

router
  .route("/seller/vi/seller/delete/ticket/:ticketId")
  .delete(authenticateJWT(PLATFORM.DEVICE), ticketController.deleteTicket);

router
  .route("/seller/vi/seller/update/ticket/:id")
  .patch(authenticateJWT(PLATFORM.DEVICE), ticketController.updateTicket);

module.exports = router;
