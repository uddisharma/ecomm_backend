/**
 * orderController.js
 * @description : exports action methods for order.
 */

const Order = require("../../../model/order");
const Product = require("../../../model/product");
const orderSchemaKey = require("../../../utils/validation/orderValidation");
const validation = require("../../../utils/validateRequest");
const dbService = require("../../../utils/dbService");

const addOrder = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    dataToCreate.customerId = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      orderSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }

    dataToCreate = new Order(dataToCreate);
    let createdOrder = await dbService.create(Order, dataToCreate);

    for (const item of dataToCreate.orderItems) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    return res.success({ data: createdOrder });
  } catch (error) {
    console.log(error);
    return res.internalServerError({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId)
      .populate("customerId", ["name", "mobileNo", "email", "shippingAddress"])
      .populate("sellerId", [
        "shopname",
        "username",
        "profile",
        "email",
        "shopaddress",
        "mobileNo",
        "deliverypartner.personal.name",
      ])
      .populate({
        path: "orderItems",
        populate: {
          path: "productId",
          model: "product",
          select: ["name", "images", "price"],
        },
      })
      .select("-isDeleted")
      .select("-charge")

      .exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrdersByUser = async (req, res) => {
  const customerId = req.user.id;

  try {
    const orders = await Order.find({ customerId })
      .populate("sellerId", ["shopname", "username"])
      .populate({
        path: "orderItems",
        populate: {
          path: "productId",
          model: "product",
          select: ["name", "images", "price"],
        },
      })
      .sort("-createdAt")

      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addOrder,
  getOrder,
  getAllOrdersByUser,
};
