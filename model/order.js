/**
 * order.js
 * @description :: model of a database collection order
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
let idValidator = require("mongoose-id-validator");
const myCustomLabels = {
  totalDocs: "itemCount",
  docs: "data",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  pagingCounter: "slNo",
  meta: "paginator",
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "user" },

    sellerId: { type: Schema.Types.ObjectId, ref: "seller" },

    addressId: {
      type: String,
      required: true,
    },

    orderItems: [
      {
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: "product" },
        color: { type: Object },
        size: { type: String },
        quantity: { type: Number },
        amount: { type: Number },
      },
    ],

    totalAmount: { type: Number },

    shipping: { type: Number },

    discount: { type: Number },

    courior: {
      type: String,
    },

    note: {
      type: String,
    },

    order: {
      type: Object,
    },

    order_id: {
      type: String,
    },

    payment: {
      type: Boolean,
      default: false,
    },

    paymentData: {
      id: {
        type: String,
      },
      method: {
        type: String,
      },
      others: {
        type: Object,
      },
    },
    status: {
      type: String,
      default: "Received",
    },
    charge: {
      type: Number,
    },
    date: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
schema.pre("save", async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

schema.pre("insertMany", async function (next, docs) {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  object.id = _id;

  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const order = mongoose.model("order", schema);
module.exports = order;
