/**
 * walletTransaction.js
 * @description :: model of a database collection walletTransaction
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
    seller: {
      type: Schema.Types.ObjectId,
      ref: "seller",
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    from: {
      type: Date,
    },
    to: {
      type: Date,
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
const Transactions = mongoose.model("Transaction", schema);
module.exports = Transactions;
