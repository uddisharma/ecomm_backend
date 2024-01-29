const SellerRequest = require("../../../model/become-seller-requests");

const createRequest = async (req, res) => {
  try {
    const seller = await SellerRequest.create(req.body);
    res.json({ status: "SUCCESS", seller });
  } catch (error) {
    res.status(500).json({ error: "Error creating seller" });
  }
};

const allRequests = async (req, res) => {
  try {
    const sellers = await SellerRequest.find();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sellers" });
  }
};

const RequestById = async (req, res) => {
  try {
    const seller = await SellerRequest.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ error: "Error fetching seller" });
  }
};

const updateRequest = async (req, res) => {
  try {
    const seller = await SellerRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ error: "Error updating seller" });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const seller = await SellerRequest.findByIdAndDelete(req.params.id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ error: "Error deleting seller" });
  }
};

module.exports = {
  createRequest,
  allRequests,
  RequestById,
  updateRequest,
  deleteRequest,
};
