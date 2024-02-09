const express = require("express");
const router = express.Router();
const ticketController = require("../../controller/admin/ticketsController");

router.post("/admin/ticket/create", ticketController.addTicket);

router.route("/admin/tickets/list").get(ticketController.getAllTickets);

router.route("/admin/tickets/:seller").get(ticketController.getSellerTickets);

router.patch("/admin/ticket/reply", ticketController.ticketReply);

router
  .route("/admin/mark/resolved/:ticketId")
  .patch(ticketController.markAsResolved);

router.route("/admin/single/ticket/:id").get(ticketController?.getSingleTicket);

router
  .route("/admin/delete/ticket/:ticketId")
  .delete(ticketController.deleteTicket);

router.route("/admin/update/ticket/:id").patch(ticketController.updateTicket);

module.exports = router;
