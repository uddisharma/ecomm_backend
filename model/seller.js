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
    shopname: { type: String },

    username: { type: String },

    cover: { type: String },

    email: { type: String },

    mobileNo: { type: String },

    alternatemobileNo: { type: String },

    password: { type: String },

    description: { type: String },

    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

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
    },

    charge: {
      type: String,
    },

    shopaddress: {
      _id: false,
      pincode: { type: String },
      address1: { type: String },
      address2: { type: String },
      landmark: { type: String },
      city: { type: String },
      state: { type: String },
    },

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
    rating: {
      rate: String,
      total: String,
    },
    discount: {
      type: String,
    },

    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      youtube: { type: String },
    },

    resetPasswordLink: {
      code: String,
      expireTime: Date,
    },

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
  this.isActive = true;
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
