const express = require("express");
const router = express.Router();
const ticketController = require("../../../controller/seller/v1/ticketsController");

router.post("/seller/vi/seller/ticket/create", ticketController.addTicket);

router
  .route("/seller/vi/seller/tickets/:seller")
  .get(ticketController.getSellerTickets);

router.patch("/seller/vi/seller/ticket/reply", ticketController.ticketReply);

router
  .route("/seller/vi/seller/mark/resolved/:ticketId")
  .patch(ticketController.markAsResolved);

router
  .route("/seller/vi/seller/single/ticket/:id")
  .get(ticketController?.getSingleTicket);

router
  .route("/seller/vi/seller/delete/ticket/:ticketId")
  .delete(ticketController.deleteTicket);

module.exports = router;
