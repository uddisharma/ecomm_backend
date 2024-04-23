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

module.exports = {
  createRequest,
};
