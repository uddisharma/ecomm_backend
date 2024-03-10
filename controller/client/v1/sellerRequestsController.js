const SellerRequest = require("../../../model/become-seller-requests");

const createRequest = async (req, res) => {
  try {
    const exist = await SellerRequest.find({
      $or: [{ email: req.body.email }, { phone: req.body?.phone }],
    });

    const exist1 = exist?.some((item) => item?.status == false);

    if (exist1) {
      return res.json({
        status: "EXIST",
        message: "Your  request is already in process.",
      });
    }
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
    const { id } = req.params;
    const updatedRequest = await SellerRequest.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedRequest) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedRequest });
  } catch (error) {
    return res.internalServerError({ message: error.query });
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
