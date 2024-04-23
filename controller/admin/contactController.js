const Contacts = require("../../model/contacts");
const dbService = require("../../utils/dbService");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const createContact = async (req, res) => {
  try {
    const contact = await Contacts.create(req.body);
    // myCache.del("allContactsadmin");
    res.json({ status: "SUCCESS", contact });
  } catch (error) {
    res.status(500).json({ error: "Error creating seller" });
  }
};

const allContacts = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      sort: { updatedAt: -1 },
    };
    let query = {};
    const chachedcontacts = myCache.get("allContactsadmin");
    // if (chachedcontacts) {
    //   return res.success({ data: JSON.parse(chachedcontacts) });
    // } else {
    let foundContacts = await dbService.paginate(Contacts, query, options);

    if (!foundContacts || !foundContacts.data || !foundContacts.data.length) {
      return res.recordNotFound();
    }
    // myCache.set("allContactsadmin", JSON.stringify(foundBanners), 21600);
    return res.success({ data: foundContacts });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const ContactById = async (req, res) => {
  try {
    const seller = await Contacts.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ error: "Error fetching seller" });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await Contacts.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedRequest) {
      return res.recordNotFound();
    }
    // myCache.del("allContactsadmin");
    return res.success({ data: updatedRequest });
  } catch (error) {
    return res.internalServerError({ message: error.query });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await Contacts.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.recordNotFound();
    }
    // myCache.del("allContactsadmin");
    return res.success({ data: deletedRequest });
  } catch (error) {
    return res.internalServerError({ message: error.query });
  }
};

module.exports = {
  createContact,
  allContacts,
  ContactById,
  updateContact,
  deleteContact,
};
