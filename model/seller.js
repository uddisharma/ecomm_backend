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

    shopname: { type: String }, //required

    username: { type: String }, //required

    cover: { type: String }, //required

    email: { type: String }, //required

    mobileNo: { type: String }, //required

    alternatemobileNo: { type: String }, //required

    password: { type: String },

    description: { type: String }, //required

    //step-2

    shopaddress: {
      //required
      _id: false,
      pincode: { type: String }, //required
      address1: { type: String }, //required
      address2: { type: String }, //required
      landmark: { type: String }, //required
      city: { type: String }, //required
      state: { type: String }, //required
    },

    //step-3

    sellingCategory: [
      //minimum 1 required
      {
        _id: false,
        category: {
          //required
          type: Schema.Types.ObjectId,
          ref: "category",
        },
        photo: {
          //required
          type: String,
        },
      },
    ],

    discount: {
      //required
      type: String,
      default: "10%",
    },

    //step-4

    socialLinks: {
      facebook: { type: String },
      instagram: { type: String }, //required
      youtube: { type: String },
    },

    //step-5

    owner: {
      //required
      personal: {
        //required
        name: { type: String }, //required
        phone: { type: String }, //required
        email: { type: String }, //required
      },
      address: {
        //required
        _id: false,
        pincode: { type: String }, //required
        address1: { type: String }, //required
        address2: { type: String }, //required
        landmark: { type: String }, //required
        city: { type: String }, //required
        state: { type: String }, //required
      },
      signature: {
        //required
        type: String,
      },
    },

    //step-6

    legal: {
      aadhar: {
        _id: false,
        name: { type: String }, //  required
        address: { type: String }, //required
        careof: { type: String }, //required
        aadharnumber: { type: String }, //12 numbers required
        signed: { type: Boolean }, // true is required
      },

      pan: {
        _id: false,
        name: { type: String }, //required
        type: { type: String }, //required
        pannumber: { type: String }, //10 numbers required
        signed: { type: Boolean }, // true is required
      },

      bank: {
        _id: false,
        name: { type: String }, //required
        branch: { type: String }, //required
        account: { type: String }, //required
        ifsc: { type: String }, //required
        signed: { type: Boolean }, // true is required
      },

      gst: { type: String },

      taxid: { type: String },

      certificate: [{ type: String }], //minimun 3 required

      signed: { type: Boolean }, // true is required
    },

    //step-7-final-step

    deliverypartner: {
      personal: {
        have: { type: Boolean }, //required
        name: { type: String },
        rate: { type: String },
      },
      partner: {
        email: { type: String }, //required
        password: { type: String }, //required
        warehouses: [
          //minimum is required
          {
            warehouse_name: { type: String }, //required
            name: { type: String }, //required
            address: { type: String }, //required
            address_2: { type: String }, //required
            city: { type: String }, //required
            state: { type: String }, //required
            pincode: { type: String }, //required
            phone: { type: String }, //required
            default: { type: Boolean }, //required
          },
        ],
      },
    },

    //for internal use

    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    rating: {
      //required
      rate: String,
      total: String,
    },

    charge: {
      //required
      type: String,
      default: "0",
    },

    priorCharge: {
      type: String,
      default: "0",
    },

    onboardAt: {
      type: Date,
    },

    resetPasswordLink: {
      code: String,
      expireTime: Date,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isOnboarded: {
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
  // this.isActive = false;
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
