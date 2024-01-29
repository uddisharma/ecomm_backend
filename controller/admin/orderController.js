/**
 * orderController.js
 * @description : exports action methods for order.
 */

const Order = require("../../model/order");
const orderSchemaKey = require("../../utils/validation/orderValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");
const ObjectId = require("mongodb").ObjectId;
const utils = require("../../utils/common");

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

/**
 * @description : find all documents of Order from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Order(s). {status, message, data}
 */
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

/**
 * @description : find document of Order from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Order. {status, message, data}
 */
const getOrder = async (req, res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message: "invalid objectId." });
    }
    query._id = req.params.id;
    let options = {};
    let foundOrder = await dbService.findOne(Order, query, options);
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

const getOrderCountForCurrentDate = async (req, res) => {
  try {
    // Get the current date in the format YYYY-MM-DD
    const currentDate = new Date().toISOString().split("T")[0];

    // Define the 'where' condition to filter orders for the current date
    const where = {
      createdAt: {
        $gte: new Date(currentDate), // Greater than or equal to the start of the current date
        $lt: new Date(
          new Date(currentDate).setDate(new Date(currentDate).getDate() + 1)
        ), // Less than the start of the next date
      },
    };

    // Use the dbService to count the number of records in the 'Order' collection for the current date
    const countedOrder = await dbService.count(Order, where);

    // Return a success response with the count of orders for the current date
    return res.success({ data: { count: countedOrder } });
  } catch (error) {
    // If an error occurs, return an internal server error response
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

module.exports = {
  addOrder,
  bulkInsertOrder,
  findAllOrder,
  getOrder,
  getOrderCount,
  getOrderCountForCurrentDate,
  updateOrder,
  bulkUpdateOrder,
  partialUpdateOrder,
  softDeleteOrder,
  deleteOrder,
  deleteManyOrder,
  softDeleteManyOrder,
};
