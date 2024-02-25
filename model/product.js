/**
 * product.js
 * @description :: model of a database collection product
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
    name: { type: String },
    price: { type: Number },
    mrp: { type: Number },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "seller",
    },
    brand: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },

    images: { type: Array },
    desc: { type: String },
    stock: { type: Number },
    tags: { type: Array },
    colors: {
      type: [
        {
          name: { type: String },
          code: { type: String },
          available: { type: Boolean, default: true },
          _id: false,
        },
      ],
    },
    sizes: {
      type: [
        {
          size: { type: String },
          available: { type: Boolean, default: true },
          _id: false,
        },
      ],
    },
    instaId: { type: String },
    weight: { type: String },
    length: { type: String },
    breadth: { type: String },
    height: { type: String },
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
const product = mongoose.model("product", schema);
module.exports = product;
