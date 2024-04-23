/**
 * user.js
 * @description :: model of a database collection user
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
let idValidator = require("mongoose-id-validator");
const bcrypt = require("bcrypt");
const { USER_TYPES } = require("../constants/authConstant");
const { convertObjectToEnum } = require("../utils/common");

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
    password: { type: String },

    mobileNo: { type: String },

    email: { type: String },

    name: { type: String },

    referralCode: { type: String, unique: true },

    shippingAddress: [
      {
        name: { type: String },
        phone: { type: String },
        phone1: { type: String },
        email: { type: String },
        pincode: { type: String },
        address: { type: String },
        landmark: { type: String },
        city: { type: String },
        district: { type: String },
        state: { type: String },
        isDefault: { type: Boolean, default: false },
        addressNo: { type: String },
      },
    ],

    userType: {
      type: Number,
      enum: convertObjectToEnum(USER_TYPES),
      required: true,
    },

    resetPasswordLink: {
      code: String,
      expireTime: Date,
    },

    loginRetryLimit: {
      type: Number,
      default: 0,
    },

    loginReactiveTime: { type: Date },

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
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
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

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
schema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.password;

  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const user = mongoose.model("user", schema);
module.exports = user;
