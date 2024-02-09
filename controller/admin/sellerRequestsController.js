const SellerRequest = require("../../model/become-seller-requests");
const dbService = require("../../utils/dbService");
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
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      sort: { updatedAt: -1 },
    };
    let query = {};

    let foundRequests = await dbService.paginate(SellerRequest, query, options);

    if (!foundRequests || !foundRequests.data || !foundRequests.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundRequests });
  } catch (error) {
    return res.internalServerError({ message: error.message });
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
    const { id } = req.params;
    const deletedRequest = await SellerRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedRequest });
  } catch (error) {
    return res.internalServerError({ message: error.query });
  }
};

module.exports = {
  createRequest,
  allRequests,
  RequestById,
  updateRequest,
  deleteRequest,
};
