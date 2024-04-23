const Order = require("../../model/order");
const orderSchemaKey = require("../../utils/validation/orderValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");
const Seller = require("../../model/seller");
const Products = require("../../model/product");
const Coupons = require("../../model/coupons");
const Tickets = require("../../model/tickets");
const mongoose = require("mongoose");

const findAllOrder = async (req, res) => {
  try {
    const requestedDate = new Date(req.query.date);

    function formatDate(dateString) {
      const dateParts = dateString.split("-");
      const formattedDate =
        dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
      return formattedDate;
    }
    const formattedDate = formatDate(req.query.date);

    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const dateStart = new Date(requestedDate);
    dateStart.setHours(0, 0, 0, 0);

    const dateEnd = new Date(requestedDate);
    dateEnd.setHours(23, 59, 59, 999);

    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      populate: [
        { path: "customerId", select: "name email shippingAddress" },
        {
          path: "orderItems.productId",
          select: "name price images",
        },
      ],
    };
    let query = {
      date: formattedDate,
    };

    if (req.query?.status && req.query.status !== "All") {
      query.status = req.query.status;
    }
    if (req.query?.courior) {
      if (req.query.courior == "Local") {
        query.courior = "Local";
      } else if (req.query.courior == "Serviceable") {
        query.courior = { $ne: "Local" };
      }
    }

    let foundOrders = await dbService.paginate(Order, query, options);
    if (!foundOrders || !foundOrders.data || !foundOrders.data.length) {
      return res.recordNotFound();
    }
    return res.success({ data: foundOrders });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getAllOrdersByUser = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const orders = await Order.find({ customerId })
      // .populate("customerId", ["firstName", "lastName", "email"])
      .populate("sellerId", ["shopname", "username"])
      .populate({
        path: "orderItems",
        populate: {
          path: "productId",
          model: "product",
          select: ["name", "images", "price"],
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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
        "owner.signature",
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

/**
 * @description : returns total number of documents of Order.
 * @param {Object} req : request including where object to apply filters in req body
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getOrderCount = async (req, res) => {
  try {
    let where = {};
    let countedOrder = await dbService.count(Order, where);
    return res.success({ data: { count: countedOrder } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getOrderCountForCurrentDate = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const where = {
      createdAt: {
        $gte: new Date(currentDate),
        $lt: new Date(
          new Date(currentDate).setDate(new Date(currentDate).getDate() + 1)
        ),
      },
    };
    const countedOrder = await dbService.count(Order, where);
    return res.success({ data: { count: countedOrder } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update document of Order with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Order.
 * @return {Object} : updated Order. {status, message, data}
 */
const updateOrder = async (req, res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy: req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      orderSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    const query = { _id: req.params.id };
    let updatedOrder = await dbService.updateOne(Order, query, dataToUpdate);
    if (!updatedOrder) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedOrder });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const softDeleteOrder = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    let query = { _id: req.params.id };
    const updateBody = {
      isDeleted: req.body.isDeleted,
    };
    let updatedOrder = await dbService.updateOne(Order, query, updateBody);
    if (!updatedOrder) {
      return res.recordNotFound();
    }
    return res.success({ data: updatedOrder });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete document of Order from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Order. {status, message, data}
 */
const deleteOrder = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }

    const query = { _id: req.params.id };
    const deletedOrder = await dbService.deleteOne(Order, query);
    if (!deletedOrder) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedOrder });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getCounts = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          charges: { $sum: "$charge" },
          numberOfOrders: { $sum: 1 },
        },
      },
    ];
    const result = await dbService.aggregate(Order, pipeline);

    const revenue =
      (result.length > 0 ? result[0].totalSales : 0) -
      (result?.length > 0 ? result[0].charges : 0);

    const orders = result.length > 0 ? result[0].numberOfOrders : 0;

    const products = await Products.countDocuments();

    const coupons = await Coupons.countDocuments();

    const tickets = await Tickets.countDocuments();

    const totalSales = result[0].totalSales;

    const platformRevenue = result[0].charges;

    return res.success({
      data: {
        revenue,
        orders,
        products,
        coupons,
        tickets,
        platformRevenue,
        totalSales,
      },
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getSellerCounts = async (req, res) => {
  try {
    const seller = mongoose.Types.ObjectId(req.params.id);

    const pipeline = [
      {
        $match: {
          sellerId: mongoose.Types.ObjectId(seller),
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          charges: { $sum: "$charge" },
          numberOfOrders: { $sum: 1 },
        },
      },
    ];
    const result = await dbService.aggregate(Order, pipeline);

    const revenue =
      (result.length > 0 ? result[0].totalSales : 0) -
      (result?.length > 0 ? result[0].charges : 0);

    const orders = result.length > 0 ? result[0].numberOfOrders : 0;

    const products = await Products.countDocuments({ sellerId: seller });

    const coupons = await Coupons.countDocuments({ seller: seller });

    const tickets = await Tickets.countDocuments({ seller: seller });

    const categories = await Seller.findOne({ seller: seller });

    let Categorycount = 0;
    if (categories) {
      Categorycount = categories?.sellingCategory?.length;
    }

    return res.success({
      data: {
        revenue: Math.ceil(revenue),
        orders,
        products,
        coupons,
        tickets,
        Categorycount,
      },
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getTotalSalesForSellerAndDate = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          date: req.query.date,
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          charges: { $sum: "$charge" },
          numberOfOrders: { $sum: 1 },
        },
      },
    ];

    const result = await dbService.aggregate(Order, pipeline);

    const revenue =
      (result.length > 0 ? result[0].totalSales : 0) -
      (result?.length > 0 ? result[0].charges : 0);

    return res.success({
      data: {
        sales: result.length > 0 ? result[0].totalSales : 0,
        orders: result.length > 0 ? result[0].numberOfOrders : 0,
        charge: result?.length > 0 ? result[0].charges : 0,
        revenue: revenue,
      },
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getTotalSalesForSellerAndDate1 = async (req, res) => {
  const sellerId = req.params.id;
  try {
    const pipeline = [
      {
        $match: {
          sellerId: mongoose.Types.ObjectId(sellerId),
          date: req.query.date,
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          charges: { $sum: "$charge" },
          numberOfOrders: { $sum: 1 },
        },
      },
    ];

    const result = await dbService.aggregate(Order, pipeline);

    const revenue =
      (result.length > 0 ? result[0].totalSales : 0) -
      (result?.length > 0 ? result[0].charges : 0);

    return res.success({
      data: {
        sales: result.length > 0 ? result[0].totalSales : 0,
        orders: result.length > 0 ? result[0].numberOfOrders : 0,
        charge: result?.length > 0 ? result[0].charges : 0,
        revenue: revenue,
      },
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getYearlySellerRevenue = async (req, res) => {
  const requestedYear = req.query.year;
  function getMonthName(monthNumber) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  }

  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${requestedYear}-01-01`),
            $lt: new Date(`${Number(requestedYear) + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const allMonthsData = Array.from({ length: 12 }, (_, index) => ({
      month: getMonthName(index + 1),
      totalRevenue: 0,
    }));

    revenueData.forEach((entry) => {
      const monthIndex = entry._id - 1;
      allMonthsData[monthIndex] = {
        _id: entry._id,
        month: getMonthName(entry._id),
        totalRevenue: entry.totalRevenue,
      };
    });

    res.json(allMonthsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const getYearlySellerRevenue1 = async (req, res) => {
  const sellerId = req.params.id;
  const requestedYear = req.query.year;
  function getMonthName(monthNumber) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  }

  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          sellerId: mongoose.Types.ObjectId(sellerId),
          createdAt: {
            $gte: new Date(`${requestedYear}-01-01`),
            $lt: new Date(`${Number(requestedYear) + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const allMonthsData = Array.from({ length: 12 }, (_, index) => ({
      month: getMonthName(index + 1),
      totalRevenue: 0,
    }));

    revenueData.forEach((entry) => {
      const monthIndex = entry._id - 1;
      allMonthsData[monthIndex] = {
        _id: entry._id,
        month: getMonthName(entry._id),
        totalRevenue: entry.totalRevenue,
      };
    });

    res.json(allMonthsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const getYearlySellerOrders = async (req, res) => {
  const requestedYear = req.query.year;

  function getMonthName(monthNumber) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  }

  try {
    const ordersCountData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${requestedYear}-01-01`),
            $lt: new Date(`${Number(requestedYear) + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const allMonthsData = Array.from({ length: 12 }, (_, index) => ({
      month: getMonthName(index + 1),
      totalOrders: 0,
    }));

    ordersCountData.forEach((entry) => {
      const monthIndex = entry._id - 1;
      allMonthsData[monthIndex] = {
        _id: entry._id,
        month: getMonthName(entry._id),
        totalOrders: entry.totalOrders,
      };
    });
    res.json(allMonthsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const getYearlySellerOrders1 = async (req, res) => {
  const sellerId = req.params.id;
  const requestedYear = req.query.year;

  function getMonthName(monthNumber) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  }

  try {
    const ordersCountData = await Order.aggregate([
      {
        $match: {
          sellerId: mongoose.Types.ObjectId(sellerId),
          createdAt: {
            $gte: new Date(`${requestedYear}-01-01`),
            $lt: new Date(`${Number(requestedYear) + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const allMonthsData = Array.from({ length: 12 }, (_, index) => ({
      month: getMonthName(index + 1),
      totalOrders: 0,
    }));

    ordersCountData.forEach((entry) => {
      const monthIndex = entry._id - 1;
      allMonthsData[monthIndex] = {
        _id: entry._id,
        month: getMonthName(entry._id),
        totalOrders: entry.totalOrders,
      };
    });
    res.json(allMonthsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const findSellerAllOrder = async (req, res) => {
  try {
    const requestedDate = new Date(req.query.date);

    function formatDate(dateString) {
      const dateParts = dateString.split("-");
      const formattedDate =
        dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
      return formattedDate;
    }
    const formattedDate = formatDate(req.query.date);

    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const dateStart = new Date(requestedDate);
    dateStart.setHours(0, 0, 0, 0);

    const dateEnd = new Date(requestedDate);
    dateEnd.setHours(23, 59, 59, 999);

    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      populate: [
        { path: "customerId", select: "name email shippingAddress" },
        {
          path: "orderItems.productId",
          select: "name price images",
        },
      ],
      sort: "-createdAt",
    };
    let query = {
      sellerId: req.params.id,
      date: formattedDate,
      isDeleted: false,
      // createdAt: { $gte: dateStart, $lte: dateEnd },
    };

    if (req.query?.status && req.query.status !== "All") {
      query.status = req.query.status;
    }
    if (req.query?.courior) {
      if (req.query.courior == "Local") {
        query.courior = "Local";
      } else if (req.query.courior == "Serviceable") {
        query.courior = { $ne: "Local" };
      }
    }

    let foundOrders = await dbService.paginate(Order, query, options);
    if (!foundOrders || !foundOrders.data || !foundOrders.data.length) {
      return res.recordNotFound();
    }
    return res.success({ data: foundOrders });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findAllDeletedSellerOrder = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      populate: [
        { path: "customerId", select: "name email shippingAddress" },
        {
          path: "orderItems.productId",
          select: "name price images",
        },
      ],
      sort: "-createdAt",
    };
    let query = {
      sellerId: req.params.id,
      isDeleted: true,
    };

    if (req.query?.status && req.query.status !== "All") {
      query.status = req.query.status;
    }
    if (req.query?.courior) {
      if (req.query.courior == "Local") {
        query.courior = "Local";
      } else if (req.query.courior == "Serviceable") {
        query.courior = { $ne: "Local" };
      }
    }

    let foundOrders = await dbService.paginate(Order, query, options);
    if (!foundOrders || !foundOrders.data || !foundOrders.data.length) {
      return res.recordNotFound();
    }
    return res.success({ data: foundOrders });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  findAllOrder,
  getOrder,
  getOrderCount,
  getOrderCountForCurrentDate,
  updateOrder,
  softDeleteOrder,
  deleteOrder,
  getAllOrdersByUser,
  getTotalSalesForSellerAndDate,
  getCounts,
  getYearlySellerRevenue,
  getYearlySellerOrders,
  getSellerCounts,
  getTotalSalesForSellerAndDate1,
  getYearlySellerOrders1,
  getYearlySellerRevenue1,
  findSellerAllOrder,
  findAllDeletedSellerOrder,
};
