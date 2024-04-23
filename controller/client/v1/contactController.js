const Contacts = require("../../../model/contacts");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});
const createContact = async (req, res) => {
  try {
    const contact = await Contacts.create(req.body);
    myCache.del("allContactsadmin");
    res.json({ status: "SUCCESS", contact });
  } catch (error) {
    res.status(500).json({ error: "Error creating seller" });
  }
};

module.exports = {
  createContact,
};
