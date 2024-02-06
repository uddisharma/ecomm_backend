const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
let idValidator = require("mongoose-id-validator");
const bcrypt = require("bcrypt");

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
    //step-1

    shopname: { type: String },

    username: { type: String },

    cover: { type: String },

    email: { type: String },

    mobileNo: { type: String },

    alternatemobileNo: { type: String },

    password: { type: String },

    description: { type: String },

    //step-2

    shopaddress: {
      _id: false,
      pincode: { type: String },
      address1: { type: String },
      address2: { type: String },
      landmark: { type: String },
      city: { type: String },
      state: { type: String },
    },

    //step-3

    sellingCategory: [
      {
        _id: false,
        category: {
          type: Schema.Types.ObjectId,
          ref: "category",
        },
        photo: {
          type: String,
        },
      },
    ],

    discount: {
      type: String,
      default: "10%",
    },

    //step-4

    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      youtube: { type: String },
    },

    //step-5

    owner: {
      personal: {
        name: { type: String },
        phone: { type: String },
        email: { type: String },
      },
      address: {
        _id: false,
        pincode: { type: String },
        address1: { type: String },
        address2: { type: String },
        landmark: { type: String },
        city: { type: String },
        state: { type: String },
      },
    },

    //step-6

    legal: {
      aadhar: {
        _id: false,
        name: { type: String },
        address: { type: String },
        careof: { type: String },
        aadharnumber: { type: String },
        signed: { type: Boolean },
      },

      pan: {
        _id: false,
        name: { type: String },
        type: { type: String },
        pannumber: { type: String },
        signed: { type: Boolean },
      },

      bank: {
        _id: false,
        name: { type: String },
        branch: { type: String },
        account: { type: String },
        ifsc: { type: String },
        signed: { type: Boolean },
      },
      gst: { type: String },

      taxid: { type: String },

      certificate: [{ type: String }],

      signed: { type: Boolean },
    },

    //step-7-final-step

    deliverypartner: {
      personal: {
        have: { type: Boolean },
        name: { type: String },
        rate: { type: String },
      },
      partner: {
        email: { type: String },
        password: { type: String },
        warehouses: [
          {
            warehouse_name: { type: String },
            name: { type: String },
            address: { type: String },
            address_2: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            phone: { type: String },
            default: { type: Boolean },
          },
        ],
        data: {
          type: Object,
        },
      },
    },

    //for internal use

    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    rating: {
      rate: String,
      total: String,
    },

    charge: {
      type: String,
    },

    resetPasswordLink: {
      code: String,
      expireTime: Date,
    },

    isActive: {
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
  this.isActive = false;
  // if (this.password) {
  //   this.password = await bcrypt.hash(this.password, 8);
  // }
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
  const seller = this;
  return bcrypt.compare(password, seller.password);
};
schema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.password;

  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const seller = mongoose.model("seller", schema);
module.exports = seller;
