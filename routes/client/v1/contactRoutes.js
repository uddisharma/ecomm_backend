const express = require("express");
const router = express.Router();
const ContactsController = require("../../../controller/client/v1/contactController");

router.post("/client/create-contact", ContactsController.createContact);

module.exports = router;
