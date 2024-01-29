/**
 * orderController.js
 * @description : exports action methods for order.
 */

const Order = require("../../../model/order");
const orderSchemaKey = require("../../../utils/validation/orderValidation");
const validation = require("../../../utils/validateRequest");
const dbService = require("../../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const utils = require("../../../utils/common");
const Seller = require("../../../model/seller");
const mongoose = require("mongoose");
const Products = require("../../../model/product");
const Coupons = require("../../../model/coupons");
const Tickets = require("../../../model/tickets");

/**
 * @description : create document of Order in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Order. {status, message, data}
 */
const addOrder = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      orderSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Order(dataToCreate);
    let createdOrder = await dbService.create(Order, dataToCreate);
    return res.success({ data: createdOrder });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : create multiple documents of Order in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Orders. {status, message, data}
 */
const bulkInsertOrder = async (req, res) => {
  try {
    if (
      req.body &&
      (!Array.isArray(req.body.data) || req.body.data.length < 1)
    ) {
      return res.badRequest();
    }
    let dataToCreate = [...req.body.data];
    for (let i = 0; i < dataToCreate.length; i++) {
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id,
      };
    }
    let createdOrders = await dbService.create(Order, dataToCreate);
    createdOrders = { count: createdOrders ? createdOrders.length : 0 };
    return res.success({ data: { count: createdOrders.count || 0 } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

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
      sellerId: req.params.id,
      date: formattedDate,
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

const getOrder = async (req, res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message: "invalid objectId." });
    }
    query._id = req.params.id;
    let options = {};
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

/**
 * @description : returns total number of documents of Order.
 * @param {Object} req : request including where object to apply filters in req body
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
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

/**
 * @description : update multiple records of Order with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Orders.
 * @return {Object} : updated Orders. {status, message, data}
 */
const bulkUpdateOrder = async (req, res) => {
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    delete dataToUpdate["addedBy"];
    if (
      req.body &&
      typeof req.body.data === "object" &&
      req.body.data !== null
    ) {
      dataToUpdate = {
        ...req.body.data,
        updatedBy: req.user.id,
      };
    }
    let updatedOrder = await dbService.updateMany(Order, filter, dataToUpdate);
    if (!updatedOrder) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: updatedOrder } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : partially update document of Order with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Order.
 * @return {obj} : updated Order. {status, message, data}
 */
const partialUpdateOrder = async (req, res) => {
  try {
    if (!req.params.id) {
      res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    delete req.body["addedBy"];
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
/**
 * @description : deactivate document of Order from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Order.
 * @return {Object} : deactivated Order. {status, message, data}
 */
const softDeleteOrder = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest({
        message: "Insufficient request parameters! id is required.",
      });
    }
    let query = { _id: req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
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

/**
 * @description : delete documents of Order in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyOrder = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id: { $in: ids } };
    const deletedOrder = await dbService.deleteMany(Order, query);
    if (!deletedOrder) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: deletedOrder } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};
/**
 * @description : deactivate multiple documents of Order from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Order.
 * @return {Object} : number of deactivated documents of Order. {status, message, data}
 */
const softDeleteManyOrder = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id: { $in: ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedOrder = await dbService.updateMany(Order, query, updateBody);
    if (!updatedOrder) {
      return res.recordNotFound();
    }
    return res.success({ data: { count: updatedOrder } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getYearlySellerRevenue = async (req, res) => {
  const sellerId = req.params.sellerId;
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
  const sellerId = req.params.sellerId;
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
  const sellerId = req.params.sellerId;
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
    const seller = mongoose.Types.ObjectId(req.params.seller);

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

    return res.success({
      data: { revenue, orders, products, coupons, tickets },
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
  addOrder,
  bulkInsertOrder,
  findAllOrder,
  getOrder,
  getOrderCount,
  updateOrder,
  bulkUpdateOrder,
  partialUpdateOrder,
  softDeleteOrder,
  deleteOrder,
  deleteManyOrder,
  softDeleteManyOrder,
  getYearlySellerRevenue,
  getYearlySellerOrders,
  getTotalSalesForSellerAndDate,
  getCounts,
  sevenDaysOrder,
};
