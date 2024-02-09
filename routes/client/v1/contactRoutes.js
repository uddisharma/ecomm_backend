const express = require("express");
const router = express.Router();
const ContactsController = require("../../../controller/client/v1/contactController");

router.post("/client/create-contact", ContactsController.createContact);
router.get("/client/contacts", ContactsController.allContacts);
router.get("/client/contact/:id", ContactsController.ContactById);
router.patch("/client/contact/:id", ContactsController.updateContact);
router.delete("/client/contact/:id", ContactsController.deleteContact);

module.exports = router;
