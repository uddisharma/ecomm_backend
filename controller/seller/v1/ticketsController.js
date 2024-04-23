const Tickets = require("../../../model/tickets");
const dbService = require("../../../utils/dbService");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

exports.addTicket = async (req, res) => {
  try {
    const { type, subject, description } = req.body;
    const seller = req.user.id;
    const newTicket = new Tickets({
      seller,
      type,
      subject,
      description,
    });
    await newTicket.save();
    // myCache.del("getAllTicketsseller");
    // myCache.del("getAllTickets1seller");
    return res.success({ data: newTicket });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const updatedTicket = await Tickets.findByIdAndUpdate(
      req.params?.id,
      req.body,
      {
        new: true,
      }
    );
    // myCache.del("getAllTicketsseller");
    // myCache.del("getAllTickets1seller");
    return res.success({ data: updatedTicket });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

exports.ticketReply = async (req, res) => {
  try {
    const { ticketId, message, time } = req.body;
    const from = req.user.id;
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          replies: { from, message, time },
        },
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.recordNotFound();
    }
    // myCache.del("getAllTicketsseller");
    // myCache.del("getAllTickets1seller");
    return res.success({ data: updatedTicket });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

exports.markAsResolved = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { closed } = req.body;
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      {
        closed: closed,
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.recordNotFound();
    }
    // myCache.del("getAllTicketsseller");
    // myCache.del("getAllTickets1seller");
    return res.success({ data: updatedTicket });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Tickets.findById(ticketId).populate({
      path: "seller",
      select: ["shopname", "username", "email"],
    });
    if (!ticket) {
      return res.recordNotFound();
    }
    return res.success({ data: ticket });
  } catch (error) {
    return res.internalServerError({ message: error.query });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const deletedTicket = await Tickets.findByIdAndDelete(ticketId);
    if (!deletedTicket) {
      return res.recordNotFound();
    }
    // myCache.del("getAllTicketsseller");
    // myCache.del("getAllTickets1seller");
    return res.success({ data: deletedTicket });
  } catch (error) {
    return res.internalServerError({ message: error.query });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    // const chachedtickets = myCache.get("getAllTicketsseller");

    // if (chachedtickets) {
    //   return res.success({ data: JSON.parse(chachedtickets) });
    // } else {
    const tickets = await Tickets.find().populate({
      path: "seller",
      select: ["shopname", "username", "email"],
    });

    // myCache.set("getAllTicketsseller", JSON.stringify(tickets), 500);
    return res.success({ data: tickets });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.query });
  }
};

exports.getSellerTickets = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      populate: [{ path: "seller", select: ["shopname", "username", "email"] }],
      sort: { updatedAt: -1 },
    };

    let query = {
      seller: req.user.id,
      isDeleted: req.query.isDeleted,
    };

    // const chachedtickets = myCache.get("getAllTickets1seller");

    // if (chachedtickets) {
    //   return res.success({ data: JSON.parse(chachedtickets) });
    // }

    let foundProducts = await dbService.paginate(Tickets, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      return res.recordNotFound();
    }
    // myCache.set("getAllTickets1seller", JSON.stringify(foundProducts), 500);
    return res.success({ data: foundProducts });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

exports.getSingleTicket = async (req, res) => {
  try {
    const ticket = await Tickets.findById(req.params.id);
    if (ticket) {
      return res.success({ data: ticket });
    } else {
      return res.recordNotFound();
    }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};
