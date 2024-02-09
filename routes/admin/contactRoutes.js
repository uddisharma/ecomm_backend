const express = require("express");
const router = express.Router();
const ContactsController = require("../../controller/admin/contactController");

router.post("/admin/create-contact", ContactsController.createContact);
router.get("/admin/contacts", ContactsController.allContacts);
router.get("/admin/contact/:id", ContactsController.ContactById);
router.patch("/admin/contact/:id", ContactsController.updateContact);
router.delete("/admin/contact/:id", ContactsController.deleteContact);

module.exports = router;
