const express = require("express");
const router = express.Router();
const ContactsController = require("../../controller/admin/contactController");
const { PLATFORM } = require("../../constants/authConstant");
const authenticateJWT = require("../../middleware/loginUser");

router.post(
  "/admin/create-contact",
  authenticateJWT(PLATFORM.ADMIN),
  ContactsController.createContact
);
router.get(
  "/admin/contacts",
  authenticateJWT(PLATFORM.ADMIN),
  ContactsController.allContacts
);
router.get(
  "/admin/contact/:id",
  authenticateJWT(PLATFORM.ADMIN),
  ContactsController.ContactById
);
router.patch(
  "/admin/contact/:id",
  authenticateJWT(PLATFORM.ADMIN),
  ContactsController.updateContact
);
router.delete(
  "/admin/contact/:id",
  authenticateJWT(PLATFORM.ADMIN),
  ContactsController.deleteContact
);

module.exports = router;
