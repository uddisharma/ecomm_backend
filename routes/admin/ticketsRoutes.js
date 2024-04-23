const express = require("express");
const router = express.Router();
const ticketController = require("../../controller/admin/ticketsController");
const authenticateJWT = require("../../middleware/loginUser");
const { PLATFORM } = require("../../constants/authConstant");

router.post(
  "/admin/ticket/create",
  authenticateJWT(PLATFORM.ADMIN),
  ticketController.addTicket
);

router
  .route("/admin/tickets/list")
  .get(authenticateJWT(PLATFORM.ADMIN), ticketController.getAllTickets);

router
  .route("/admin/tickets/:seller")
  .get(authenticateJWT(PLATFORM.ADMIN), ticketController.getSellerTickets);

router.patch(
  "/admin/ticket/reply",
  authenticateJWT(PLATFORM.ADMIN),
  ticketController.ticketReply
);

router
  .route("/admin/mark/resolved/:ticketId")
  .patch(authenticateJWT(PLATFORM.ADMIN), ticketController.markAsResolved);

router
  .route("/admin/single/ticket/:id")
  .get(authenticateJWT(PLATFORM.ADMIN), ticketController?.getSingleTicket);

router
  .route("/admin/delete/ticket/:ticketId")
  .delete(authenticateJWT(PLATFORM.ADMIN), ticketController.deleteTicket);

router
  .route("/admin/update/ticket/:id")
  .patch(authenticateJWT(PLATFORM.ADMIN), ticketController.updateTicket);

module.exports = router;
