const Tickets = require("../../model/tickets");
const dbService = require("../../utils/dbService");

exports.addTicket = async (req, res) => {
  try {
    const { seller, type, subject, description } = req.body;
    const newTicket = new Tickets({
      seller,
      type,
      subject,
      description,
    });
    await newTicket.save();
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
    return res.success({ data: updatedTicket });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

exports.ticketReply = async (req, res) => {
  try {
    const { ticketId, from, message, time } = req.body;
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
    return res.success({ data: deletedTicket });
  } catch (error) {
    return res.internalServerError({ message: error.query });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    let options = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      skip: (Number(req.query.page) - 1) * Number(req.query.limit),
      populate: [
        { path: "seller", select: ["shopname", "username", "email", "cover"] },
      ],
      sort: { updatedAt: -1 },
    };

    let query = {
      isDeleted: req.query.isDeleted,
    };

    let foundProducts = await dbService.paginate(Tickets, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundProducts });
  } catch (error) {
    return res.internalServerError({ message: error.message });
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
      seller: req.params?.seller,
      isDeleted: req.query.isDeleted,
    };

    let foundProducts = await dbService.paginate(Tickets, query, options);

    if (!foundProducts || !foundProducts.data || !foundProducts.data.length) {
      return res.recordNotFound();
    }

    return res.success({ data: foundProducts });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

exports.getSingleTicket = async (req, res) => {
  try {
    const ticket = await Tickets.findById(req.params.id).populate({
      path: "seller",
      select: "shopname email phone cover username",
    });
    if (ticket) {
      return res.success({ data: ticket });
    } else {
      return res.recordNotFound();
    }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};
