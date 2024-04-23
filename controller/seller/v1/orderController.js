const Order = require("../../../model/order");
const orderSchemaKey = require("../../../utils/validation/orderValidation");
const validation = require("../../../utils/validateRequest");
const dbService = require("../../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");
const Seller = require("../../../model/seller");
const Products = require("../../../model/product");
const Coupons = require("../../../model/coupons");
const Tickets = require("../../../model/tickets");

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
      sellerId: req.user.id,
      date: formattedDate,
      isDeleted: false,
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

const updateOrder = async (req, res) => {
  try {
    let dataToUpdate = {
      status: req.body.status,
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

const getOrder = async (req, res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message: "invalid objectId." });
    }
    query._id = req.params.id;

    let foundOrder = await Order.findById(req.params.id).populate([
      {
        path: "customerId",
        select: "shippingAddress",
      },
      {
        path: "orderItems.productId",
        select: "name price images",
      },
    ]);
    if (!foundOrder) {
      return res.recordNotFound();
    }
    return res.success({ data: foundOrder });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getOrderCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      orderSchemaKey.findFilterKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === "object" && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedOrder = await dbService.count(Order, where);
    return res.success({ data: { count: countedOrder } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getYearlySellerRevenue = async (req, res) => {
  const sellerId = req.user.id;
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
  const sellerId = req.user.id;
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

const getTotalSalesForSellerAndDate = async (req, res) => {
  const sellerId = req.user.id;
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

const getCounts = async (req, res) => {
  try {
    const seller = mongoose.Types.ObjectId(req.user.id);

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

const sevenDaysOrder = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const inputDate = new Date(sevenDaysAgo);
    const outputTimeStr = inputDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    const aggregationPipeline = [
      {
        $match: {
          sellerId: mongoose.Types.ObjectId(req.params.seller),
          $expr: {
            $gte: [{ $toDate: "$date" }, new Date(outputTimeStr)],
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: { $toDate: "$date" } },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          dayOfWeek: "$_id",
          totalRevenue: 1,
        },
      },
    ];

    const result = await Order.aggregate(aggregationPipeline);

    const dayNamesMapping = [
      "Sun",
      "Mon",
      "Tues",
      "Wed",
      "Thurs",
      "Fri",
      "Sat",
    ];

    const response = {};
    dayNamesMapping.forEach((dayName, index) => {
      const matchingResult = result.find((item) => item.dayOfWeek === index);
      response[dayName] = matchingResult ? matchingResult.totalRevenue : 0;
    });

    res.json(response);
  } catch (error) {
    console.error("Error calculating last month revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  findAllOrder,
  getOrder,
  getOrderCount,
  getYearlySellerRevenue,
  getYearlySellerOrders,
  getTotalSalesForSellerAndDate,
  getCounts,
  sevenDaysOrder,
  updateOrder,
};
