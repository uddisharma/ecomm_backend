const User = require("../model/user");
const Admin = require("../model/admin");
const Category = require("../model/category");
const Seller = require("../model/seller");
const Product = require("../model/product");
const Referral = require("../model/refferrals");
const Banner = require("../model/banner");
const Contact = require("../model/contacts");
const Tickets = require("../model/tickets");
const SellerRequest = require("../model/become-seller-requests");
const Transaction = require("../model/transactions");
const Order = require("../model/order");
const Coupon = require("../model/coupons");
const authConstant = require("../constants/authConstant");
const dbService = require("../utils/dbService");

function generateReferralCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let referralCode = "";
  for (let i = 0; i < 6; i++) {
    referralCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return referralCode;
}

function getTodaysDate() {
  const dateObj = new Date();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${month}/${day}/${year}`;
}

function generateOrderId() {
  const characters = "12345467890";
  let orderId = "";
  for (let i = 0; i < 8; i++) {
    orderId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return orderId;
}

const usersToBeInserted = [
  {
    _id: "65c1f686df560ddb338a8016",
    password: "Deepak@123",
    mobileNo: "7015713717",
    email: "uddibhardwaj08@gmail.com",
    name: "Deepak Sharma",
    referralCode: generateReferralCode(),
    shippingAddress: [
      {
        _id: "65c1f686df560ddb338a8017",
        name: "Deepak Sharma",
        phone: "9876543210",
        phone1: "9876543211",
        email: "uddibhardwaj08@gmail.com",
        pincode: "126102",
        address: "VPO Nidani",
        landmark: "Near Shiv Mandir",
        city: "Jind",
        district: "Jind",
        state: "Haryana",
        isDefault: true,
        addressNo: "65c1f686df560ddb338a8017",
      },
    ],
    userType: authConstant.USER_TYPES.User,
    isDeleted: false,
  },
  {
    _id: "65e07bb893c5f94ed340fff9",
    password: "Deepak@123",
    mobileNo: "7355810933",
    email: "uddibhardwaj2001@gmail.com",
    name: "Udit Sharma",
    referralCode: generateReferralCode(),
    shippingAddress: [
      {
        _id: "65f3cbd8d2d18d9b42f38bef",
        name: "Udit Sharma",
        phone: "9876543210",
        phone1: "9876543211",
        email: "uddibhardwaj2001@gmail.com",
        pincode: "126102",
        address: "Bhartnagar Colony",
        landmark: "Near School",
        city: "Karnal",
        district: "Karnal",
        state: "Haryana",
        isDefault: true,
        addressNo: "65f3cbd8d2d18d9b42f38bef",
      },
    ],
    userType: authConstant.USER_TYPES.User,
    isDeleted: false,
  },
];

const adminToBeInserted = [
  {
    _id: "65b63e807f45a061fbee13ac",
    password: "Deepak@123",
    mobileNo: "7355810933",
    email: "uddibhardwaj08@gmail.com",
    name: "Udit Sharma",
    userType: 2,
    profile:
      "https://utfs.io/f/97b841f7-7256-4a03-940e-48cb186107c5-hod9we.webp",
  },
];

const categoriesToBeInserted = [
  { _id: "657dbccf5fa71e5ed0e4fc18", name: "Men" },
  { _id: "657dbccf5fa71e5ed0e4fc19", name: "Women" },
  { _id: "657dbccf5fa71e5ed0e4fc1b", name: "All" },
  { _id: "657dbccf5fa71e5ed0e4fc1a", name: "Children" },
  {
    _id: "657dbd585fa71e5ed0e4fc20",
    name: "Top",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc18",
  },
  {
    _id: "657dbd585fa71e5ed0e4fc21",
    name: "Bottom",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc18",
  },
  {
    _id: "657dbd585fa71e5ed0e4fc22",
    name: "Winter",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc18",
  },
  {
    _id: "657dbd585fa71e5ed0e4fc23",
    name: "Shoes",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc18",
  },
  {
    _id: "657dbd855fa71e5ed0e4fc2c",
    name: "Top",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc19",
  },
  {
    _id: "657dbd855fa71e5ed0e4fc2d",
    name: "Bottom",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc19",
  },
  {
    _id: "657dbd855fa71e5ed0e4fc2e",
    name: "Winter",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc19",
  },
  {
    _id: "657dbd855fa71e5ed0e4fc2f",
    name: "Shoes",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc19",
  },
  {
    _id: "657dbd9a5fa71e5ed0e4fc38",
    name: "Top",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc1a",
  },
  {
    _id: "657dbd9a5fa71e5ed0e4fc39",
    name: "Bottom",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc1a",
  },
  {
    _id: "657dbd9a5fa71e5ed0e4fc3a",
    name: "Winter",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc1a",
  },
  {
    _id: "657dbd9a5fa71e5ed0e4fc3b",
    name: "Shoes",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc1a",
  },
  {
    _id: "657dbde35fa71e5ed0e4fc44",
    name: "Accessories",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc1b",
  },
  {
    _id: "657dbde35fa71e5ed0e4fc45",
    name: "Under Pant",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc1b",
  },
  {
    _id: "657dbde35fa71e5ed0e4fc46",
    name: "Jewellery",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc1b",
  },
  {
    _id: "657dbde35fa71e5ed0e4fc47",
    name: "Beauty",
    parentCategoryId: "657dbccf5fa71e5ed0e4fc1b",
  },
  {
    _id: "657dbe515fa71e5ed0e4fc62",
    name: "Shirt",
    parentCategoryId: "657dbd585fa71e5ed0e4fc20",
  },
  {
    _id: "657dbe515fa71e5ed0e4fc61",
    name: "T-Shirt",
    parentCategoryId: "657dbd585fa71e5ed0e4fc20",
  },
  {
    _id: "657dbe9d5fa71e5ed0e4fc68",
    name: "Formal Pants",
    parentCategoryId: "657dbd585fa71e5ed0e4fc21",
  },
  {
    _id: "657dbe9d5fa71e5ed0e4fc67",
    name: "Jeans",
    parentCategoryId: "657dbd585fa71e5ed0e4fc21",
  },
  {
    _id: "657dbe9d5fa71e5ed0e4fc69",
    name: "Lowers",
    parentCategoryId: "657dbd585fa71e5ed0e4fc21",
  },
  {
    _id: "657dbe9d5fa71e5ed0e4fc6a",
    name: "Shorts",
    parentCategoryId: "657dbd585fa71e5ed0e4fc21",
  },
  {
    _id: "657dbf155fa71e5ed0e4fc74",
    name: "Sweaters",
    parentCategoryId: "657dbd585fa71e5ed0e4fc22",
  },
  {
    _id: "657dbf155fa71e5ed0e4fc73",
    name: "Jackets",
    parentCategoryId: "657dbd585fa71e5ed0e4fc22",
  },
  {
    _id: "657dbf155fa71e5ed0e4fc75",
    name: "Hoodies",
    parentCategoryId: "657dbd585fa71e5ed0e4fc22",
  },
  {
    _id: "657dbf155fa71e5ed0e4fc77",
    name: "Blazzers",
    parentCategoryId: "657dbd585fa71e5ed0e4fc22",
  },
  {
    _id: "657dbf155fa71e5ed0e4fc76",
    name: "Track Suits",
    parentCategoryId: "657dbd585fa71e5ed0e4fc22",
  },
  {
    _id: "657dbf155fa71e5ed0e4fc78",
    name: "Pent Coat",
    parentCategoryId: "657dbd585fa71e5ed0e4fc22",
  },
  {
    _id: "657dbf7a5fa71e5ed0e4fc85",
    name: "Sports",
    parentCategoryId: "657dbd585fa71e5ed0e4fc23",
  },
  {
    _id: "657dbf7a5fa71e5ed0e4fc86",
    name: "Formal",
    parentCategoryId: "657dbd585fa71e5ed0e4fc23",
  },
  {
    _id: "657dbf7a5fa71e5ed0e4fc87",
    name: "High Neck",
    parentCategoryId: "657dbd585fa71e5ed0e4fc23",
  },
  {
    _id: "657dbf7a5fa71e5ed0e4fc88",
    name: "Boots",
    parentCategoryId: "657dbd585fa71e5ed0e4fc23",
  },
  {
    _id: "657dbf7a5fa71e5ed0e4fc89",
    name: "Sneakers",
    parentCategoryId: "657dbd585fa71e5ed0e4fc23",
  },
  {
    _id: "657dbf7a5fa71e5ed0e4fc8a",
    name: "Loafers",
    parentCategoryId: "657dbd585fa71e5ed0e4fc23",
  },
  {
    _id: "657dbf7a5fa71e5ed0e4fc8b",
    name: "Sleepers",
    parentCategoryId: "657dbd585fa71e5ed0e4fc23",
  },
  {
    _id: "657dbfa85fa71e5ed0e4fc9a",
    name: "Sandals",
    parentCategoryId: "657dbd585fa71e5ed0e4fc23",
  },
  {
    _id: "657dc03c5fa71e5ed0e4fc9e",
    name: "Tops",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
  {
    _id: "657dc03c5fa71e5ed0e4fc9d",
    name: "T-Shirts",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
  {
    _id: "657dc03c5fa71e5ed0e4fca0",
    name: "Saree",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
  {
    _id: "657dc03c5fa71e5ed0e4fca1",
    name: "Gowns",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
  {
    _id: "657dc03c5fa71e5ed0e4fca2",
    name: "Jump Suit",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
  {
    _id: "657dc03c5fa71e5ed0e4fca3",
    name: "Blouse",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
  {
    _id: "657dc03c5fa71e5ed0e4fc9f",
    name: "Kurta",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
  {
    _id: "657dc03c5fa71e5ed0e4fca4",
    name: "Dupatta",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
  {
    _id: "657dc0b95fa71e5ed0e4fcb5",
    name: "Jeans",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2d",
  },
  {
    _id: "657dc0b95fa71e5ed0e4fcb7",
    name: "Leggings",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2d",
  },
  {
    _id: "657dc0b95fa71e5ed0e4fcb6",
    name: "Trousers",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2d",
  },
  {
    _id: "657dc0b95fa71e5ed0e4fcb8",
    name: "Plazzo",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2d",
  },
  {
    _id: "657dc0b95fa71e5ed0e4fcb9",
    name: "Sharara",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2d",
  },
  {
    _id: "657dc0b95fa71e5ed0e4fcba",
    name: "Salwar",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2d",
  },
  {
    _id: "657dc0b95fa71e5ed0e4fcbb",
    name: "Dhoti",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2d",
  },
  {
    _id: "657dc0b95fa71e5ed0e4fcbc",
    name: "Peticot",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2d",
  },
  {
    _id: "657dc1345fa71e5ed0e4fccd",
    name: "jackets",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2e",
  },
  {
    _id: "657dc1345fa71e5ed0e4fcce",
    name: "Sweaters",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2e",
  },
  {
    _id: "657dc1345fa71e5ed0e4fccf",
    name: "Hoodies",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2e",
  },
  {
    _id: "657dc1345fa71e5ed0e4fcd0",
    name: "Track Suits",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2e",
  },
  {
    _id: "657dc1345fa71e5ed0e4fcd1",
    name: "Blazzers",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2e",
  },
  {
    _id: "657dc18f5fa71e5ed0e4fcdd",
    name: "Sneakers",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2f",
  },
  {
    _id: "657dc18f5fa71e5ed0e4fcdc",
    name: "Sports",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2f",
  },
  {
    _id: "657dc18f5fa71e5ed0e4fcde",
    name: "High Neck",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2f",
  },
  {
    _id: "657dc18f5fa71e5ed0e4fce0",
    name: "Hills",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2f",
  },
  {
    _id: "657dc18f5fa71e5ed0e4fcdf",
    name: "Boots",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2f",
  },
  {
    _id: "657dc18f5fa71e5ed0e4fce1",
    name: "Slippers",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2f",
  },
  {
    _id: "657dc2255fa71e5ed0e4fcf2",
    name: "Boys T-Shirts",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc38",
  },
  {
    _id: "657dc2255fa71e5ed0e4fcf3",
    name: "Boys Shirts",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc38",
  },
  {
    _id: "657dc2255fa71e5ed0e4fcf4",
    name: "Girls T-Shirts",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc38",
  },
  {
    _id: "657dc2255fa71e5ed0e4fcf5",
    name: "Girls Shirts",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc38",
  },
  {
    _id: "657dc2255fa71e5ed0e4fcf6",
    name: "Girls Top",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc38",
  },
  {
    _id: "657dc2255fa71e5ed0e4fcf7",
    name: "Girls Dress",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc38",
  },
  {
    _id: "657dc2735fa71e5ed0e4fd04",
    name: "Boys Jeans",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc39",
  },
  {
    _id: "657dc2735fa71e5ed0e4fd05",
    name: "Boys Lowers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc39",
  },
  {
    _id: "657dc2735fa71e5ed0e4fd06",
    name: "Girls Shorts",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc39",
  },
  {
    _id: "657dc2735fa71e5ed0e4fd07",
    name: "Girls Jeans",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc39",
  },
  {
    _id: "657dc2735fa71e5ed0e4fd08",
    name: "Girls Plazzo",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc39",
  },
  {
    _id: "657dc2735fa71e5ed0e4fd09",
    name: "Girls Leggings",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc39",
  },
  {
    _id: "657dc2735fa71e5ed0e4fd0a",
    name: "Girls Trousers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc39",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd19",
    name: "Boys Jacket",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd1a",
    name: "Boys Sweater",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd1b",
    name: "Boys Hoodie",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd1d",
    name: "Boys Blazzers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd1c",
    name: "Boys Track Suits",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd1e",
    name: "Boys Pent Coat",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd20",
    name: "Girls Sweater",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd1f",
    name: "Girls Jacket",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd21",
    name: "Girls Hoodie",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd22",
    name: "Girls Track Suits",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc31d5fa71e5ed0e4fd23",
    name: "Girls Blazzers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3a",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd3b",
    name: "Boys Sneakers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd3c",
    name: "Boys Boots",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd3d",
    name: "Boys Formal",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd3a",
    name: "Boys Sports",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd41",
    name: "Boys Sleepers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd3e",
    name: "Boys High Neck",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd43",
    name: "Girls Sneakers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd3f",
    name: "Boys Loafers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd44",
    name: "Girls High Neck",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd42",
    name: "Girls Sports",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd46",
    name: "Girls Hills",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd40",
    name: "Boys Sandals",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd45",
    name: "Girls Boots",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3ae5fa71e5ed0e4fd47",
    name: "Girls Sleepers",
    parentCategoryId: "657dbd9a5fa71e5ed0e4fc3b",
  },
  {
    _id: "657dc3de5fa71e5ed0e4fd64",
    name: "Men",
    parentCategoryId: "657dbde35fa71e5ed0e4fc44",
  },
  {
    _id: "657dc3de5fa71e5ed0e4fd65",
    name: "Women",
    parentCategoryId: "657dbde35fa71e5ed0e4fc44",
  },
  {
    _id: "657dc3fa5fa71e5ed0e4fd6c",
    name: "Boys",
    parentCategoryId: "657dbde35fa71e5ed0e4fc45",
  },
  {
    _id: "657dc3fa5fa71e5ed0e4fd6b",
    name: "Women",
    parentCategoryId: "657dbde35fa71e5ed0e4fc45",
  },
  {
    _id: "657dc3fa5fa71e5ed0e4fd6a",
    name: "Men",
    parentCategoryId: "657dbde35fa71e5ed0e4fc45",
  },
  {
    _id: "657dc3fa5fa71e5ed0e4fd6d",
    name: "Girls",
    parentCategoryId: "657dbde35fa71e5ed0e4fc45",
  },
  {
    _id: "657dc4255fa71e5ed0e4fd76",
    name: "Men",
    parentCategoryId: "657dbde35fa71e5ed0e4fc46",
  },
  {
    _id: "657dc4255fa71e5ed0e4fd77",
    name: "Women",
    parentCategoryId: "657dbde35fa71e5ed0e4fc46",
  },
  {
    _id: "657dc4365fa71e5ed0e4fd7d",
    name: "Women",
    parentCategoryId: "657dbde35fa71e5ed0e4fc47",
  },
  {
    _id: "657dc4365fa71e5ed0e4fd7c",
    name: "Men",
    parentCategoryId: "657dbde35fa71e5ed0e4fc47",
  },
  {
    _id: "657dd588a5933697e67a2977",
    name: "Shirts",
    parentCategoryId: "657dbd855fa71e5ed0e4fc2c",
  },
];

const sellersToBeInserted = [
  {
    _id: "6582baa498f7bc90135101ff",
    shopname: "Bansal Boot House",
    username: "bansal_boot_house",
    cover: "https://utfs.io/f/4c538278-3bc5-43bb-b740-4fdcf65d3c5d-hnyr22.png",
    email: "uddibhardwaj08@gmail.com",
    mobileNo: "1234567890",
    alternatemobileNo: "9876543210",
    description: "<p>This is a sample shop description</p>",
    legal: {
      aadhar: {
        name: "Aadhar Holder Name",
        address: "Aadhar Address ",
        careof: "Care of Name",
        aadharnumber: "1234 5678 9012",
        signed: true,
      },
      pan: {
        type: "Individual",
        name: "PAN Holder Name",
        pannumber: "ABCDE1234F",
        signed: true,
      },
      bank: {
        name: "Bank Name",
        branch: "Branch Name",
        account: "1234567890",
        ifsc: "ABCD1234567",
        signed: true,
      },
      gst: "GST123456789",
      taxid: "TaxID1234",
      signed: true,
      certificate: [
        "https://utfs.io/f/12fbf82f-185b-4988-b349-662a62b7df11-lzmv9u.png",
        "https://utfs.io/f/6b0aa522-3cb3-4e2e-be98-4bd46d430022-lzmb6e.png",
        "https://utfs.io/f/4381fe3f-8cd4-4cb2-b9e3-9c0b58a39614-lzmaj7.png",
      ],
    },
    charge: "0",
    priorCharge: "2.5",
    onboardAt: new Date(),
    shopaddress: {
      pincode: "124112",
      address1: "Shop Address ",
      address2: "Shop Address Line 2 ",
      landmark: "Near Landmark",
      city: "City",
      state: "State",
    },
    deliverypartner: {
      personal: {
        name: "DTDC Logistics ",
        rate: "60",
        have: true,
      },
      partner: {
        email: "uddibhardwaj08+1221@gmail.com",
        password: "uJ6VqGLwsX",
        warehouses: [
          {
            warehouse_name: "warehouse 2",
            name: "Udit Sharma",
            address: "365A Railway colony",
            address_2: "Near metro station",
            city: "Jind",
            state: "Haryana",
            pincode: "122001",
            phone: "9999999999",
            default: false,
            _id: "65a37a2059f74d22e458c46e",
          },
          {
            warehouse_name: "warehouse 1",
            name: "Deepak Sharma",
            address: "140, MG Road",
            address_2: "Near metro station",
            city: "Gurgaon",
            state: "Haryana",
            pincode: "122001",
            phone: "9999999999",
            default: false,
            _id: "65a37a2059f74d22e458c46d",
          },
          {
            warehouse_name: "warehouse 3",
            name: "Kamal Sharma",
            address: "365A Railway colony",
            address_2: "Near metro station",
            city: "Rohtak",
            state: "Haryana",
            pincode: "124001",
            phone: "9999999999",
            default: true,
            _id: "65a37a2059f74d22e458c46f",
          },
        ],
      },
    },
    sellingCategory: [
      {
        category: "657dbe515fa71e5ed0e4fc61",
        photo:
          "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065500/men_tshirt_omodg7.webp",
      },
      {
        category: "657dbe9d5fa71e5ed0e4fc67",
        photo:
          "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065766/men_jeans_cjm7hw.webp",
      },
      {
        category: "657dc03c5fa71e5ed0e4fc9f",
        photo:
          "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065886/women_kurta_y9y6n2.webp",
      },
      {
        category: "657dbf7a5fa71e5ed0e4fc85",
        photo:
          "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703066123/men_shoes_seynus.webp",
      },
      {
        category: "657dc0b95fa71e5ed0e4fcb6",
        photo:
          "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065999/women_trouser_w0mloi.webp",
      },
    ],
    rating: {
      rate: "4.5",
      total: "120",
    },
    discount: "10%",
    socialLinks: {
      instagram: "https://www.instagram.com/udit.x_",
      facebook: "https://www.facebook.com/udit.x_",
      youtube: "https://www.youtube.com/channel/UC_FPHVp9ZW00p9JQbxs5bbg",
    },

    owner: {
      personal: {
        name: "Owner Name",
        email: "owner@email.com",
        phone: "917355810933",
      },
      address: {
        address1: "Owner Address Line 1",
        address2: "Owner Address Line 2 ",
        landmark: "Owner Landmark",
        city: "Owner City",
        state: "Owner State",
        pincode: "654321",
      },
      signature:
        "https://d1g6ilmrb89tca.cloudfront.net/73bc984f232ddf7dec1054b567c82451accee5a0775baa04673112eb347fb966",
    },
    password: "Deepak@123",
    isActive: true,
    isDeleted: false,
    isOnboarded: true,
    referredBy: "65c1f686df560ddb338a8016",
  },
  {
    _id: "660d0e9aebfab05056c0dba5",
    shopname: "The Kapde Lehree",
    username: "the_kapde_lehree",
    cover:
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1697650326/cld-sample-2.jpg",
    email: "uddibhardwaj2001@gmail.com",
    mobileNo: "1234567890",
    alternatemobileNo: "9876543210",
    description: "<p>This is a sample shop description</p>",
    legal: {
      aadhar: {
        name: "Aadhar Holder Name",
        address: "Aadhar Address ",
        careof: "Care of Name",
        aadharnumber: "1234 5678 9012",
        signed: true,
      },
      pan: {
        type: "Individual",
        name: "PAN Holder Name",
        pannumber: "ABCDE1234F",
        signed: true,
      },
      bank: {
        name: "Bank Name",
        branch: "Branch Name",
        account: "1234567890",
        ifsc: "ABCD1234567",
        signed: true,
      },
      gst: "GST123456789",
      taxid: "TaxID1234",
      signed: true,
      certificate: [
        "https://utfs.io/f/12fbf82f-185b-4988-b349-662a62b7df11-lzmv9u.png",
        "https://utfs.io/f/6b0aa522-3cb3-4e2e-be98-4bd46d430022-lzmb6e.png",
        "https://utfs.io/f/4381fe3f-8cd4-4cb2-b9e3-9c0b58a39614-lzmaj7.png",
      ],
    },
    charge: "0",
    priorCharge: "2",
    onboardAt: new Date(),
    shopaddress: {
      pincode: "124112",
      address1: "Shop Address ",
      address2: "Shop Address Line 2 ",
      landmark: "Near Landmark",
      city: "City",
      state: "State",
    },
    deliverypartner: {
      personal: {
        name: "DTDC Logistics ",
        rate: "60",
        have: true,
      },
      partner: {
        email: "uddibhardwaj08+1221@gmail.com",
        password: "uJ6VqGLwsX",
        warehouses: [
          {
            warehouse_name: "warehouse 2",
            name: "Udit Sharma",
            address: "365A Railway colony",
            address_2: "Near metro station",
            city: "Jind",
            state: "Haryana",
            pincode: "122001",
            phone: "9999999999",
            default: false,
            _id: "65a37a2059f74d22e458c46e",
          },
          {
            warehouse_name: "warehouse 3",
            name: "Kamal Sharma",
            address: "365A Railway colony",
            address_2: "Near metro station",
            city: "Rohtak",
            state: "Haryana",
            pincode: "124001",
            phone: "9999999999",
            default: true,
            _id: "65a37a2059f74d22e458c46f",
          },
        ],
      },
    },
    sellingCategory: [
      {
        category: "657dbe515fa71e5ed0e4fc61",
        photo:
          "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065500/men_tshirt_omodg7.webp",
      },
      {
        category: "657dbe9d5fa71e5ed0e4fc67",
        photo:
          "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703065766/men_jeans_cjm7hw.webp",
      },
    ],
    rating: {
      rate: "4.6",
      total: "95",
    },
    discount: "10%",
    socialLinks: {
      instagram: "https://www.instagram.com/udit.x_",
      facebook: "https://www.facebook.com/udit.x_",
      youtube: "https://www.youtube.com/channel/UC_FPHVp9ZW00p9JQbxs5bbg",
    },

    owner: {
      personal: {
        name: "Owner Name",
        email: "owner@email.com",
        phone: "917355810933",
      },
      address: {
        address1: "Owner Address Line 1",
        address2: "Owner Address Line 2 ",
        landmark: "Owner Landmark",
        city: "Owner City",
        state: "Owner State",
        pincode: "654321",
      },
      signature:
        "https://d1g6ilmrb89tca.cloudfront.net/73bc984f232ddf7dec1054b567c82451accee5a0775baa04673112eb347fb966",
    },
    password: "Deepak@123",
    isActive: true,
    isDeleted: false,
    isOnboarded: true,
    referredBy: "65e07bb893c5f94ed340fff9",
  },
];

const productsToBeInserted = [
  {
    _id: "65db2b4bbe39eb18d4230ddd",
    name: "Men Lycra T-Shirts",
    price: 399,
    mrp: 499,
    sellerId: "6582baa498f7bc90135101ff",
    brand: "Adidas",
    category: "657dbe515fa71e5ed0e4fc61",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703066937/adidas_tshirt_yvvoi0.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703066937/adidas_tshirt_yvvoi0.webp",
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    stock: 0,
    tags: ["Adidas", "T-Shirt", "Men", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: false,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Violaa",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "SM",
        available: true,
      },
      {
        size: "MD",
        available: true,
      },
      {
        size: "XL",
        available: false,
      },
      {
        size: "XXL",
        available: true,
      },
    ],
    instaId: "C1EeuRXJdJ7",
    weight: "300",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230dde",
    name: "Men Nike T-Shirts",
    price: 549,
    mrp: 599,
    sellerId: "6582baa498f7bc90135101ff",
    brand: "Adidas",
    category: "657dbe515fa71e5ed0e4fc61",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703067585/men_nike_tsirt_cozanq.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703067585/men_nike_tsirt_cozanq.webp",
    ],
    desc: "<p>Lorem ipsum dolor sit amet, jalebi consectetur adipiscing elit.</p>",
    stock: 79,
    tags: ["Nike", "T-Shirt", "Men", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "SM",
        available: true,
      },
      {
        size: "MD",
        available: true,
      },
      {
        size: "XL",
        available: true,
      },
      {
        size: "XXL",
        available: true,
      },
    ],
    instaId: "C30BBNwsaFe",
    weight: "300",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230ddf",
    name: "Streachable Jeans",
    price: 399,
    mrp: 499,
    sellerId: "6582baa498f7bc90135101ff",
    brand: "Jack&Johns",
    category: "657dbe9d5fa71e5ed0e4fc67",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703067355/men_jeans_febalz.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703067355/men_jeans_febalz.webp",
    ],
    desc: "Lorem ipsum dolor sit amet, jeans1 consectetur adipiscing elit.",
    stock: 100,
    tags: ["Pent", "jeans", "Men", "Fashion1"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "SM",
        available: true,
      },
      {
        size: "MD",
        available: true,
      },
      {
        size: "XL",
        available: true,
      },
      {
        size: "XXL",
        available: true,
      },
    ],
    instaId: "C03bi8fJ8uw",
    weight: "300",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230de2",
    name: "Cotton Tshirt",
    price: 555,
    mrp: 599,
    sellerId: "6582baa498f7bc90135101ff",
    brand: "Reebok",
    category: "657dbe515fa71e5ed0e4fc61",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703069224/men_tshirt_cmma9x.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703069224/men_tshirt_cmma9x.webp",
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    stock: 100,
    tags: ["T-Shirt", "Reebok", "Men", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "SM",
        available: true,
      },
      {
        size: "MD",
        available: true,
      },
      {
        size: "XL",
        available: true,
      },
      {
        size: "XXL",
        available: true,
      },
    ],
    instaId: "C1Cx1K3P5IQ",
    weight: "300",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230de5",
    name: "Solid Black T-Shirt",
    price: 289,
    mrp: 399,
    sellerId: "6582baa498f7bc90135101ff",
    brand: "Adidas",
    category: "657dbe515fa71e5ed0e4fc61",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703076668/men_tshirt_nb1s55.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703076668/men_tshirt_nb1s55.webp",
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    stock: 100,
    tags: ["Tshirt", "Adidas", "Men", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "SM",
        available: true,
      },
      {
        size: "MD",
        available: true,
      },
      {
        size: "XL",
        available: true,
      },
      {
        size: "XXL",
        available: true,
      },
    ],
    instaId: "C09U4o5Bj2S",
    weight: "500",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230de3",
    name: "Redtape Lower",
    price: 399,
    mrp: 599,
    sellerId: "660d0e9aebfab05056c0dba5",
    brand: "Redtape",
    category: "657dbe9d5fa71e5ed0e4fc69",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703069309/men_lower_u5hnp9.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703069309/men_lower_u5hnp9.webp",
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    stock: 100,
    tags: ["Lower", "Redtape", "Men", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "SM",
        available: true,
      },
      {
        size: "MD",
        available: true,
      },
      {
        size: "XL",
        available: true,
      },
      {
        size: "XXL",
        available: true,
      },
    ],
    instaId: "C1Cx1K3P5IQ",
    weight: "300",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230de6",
    name: "Black T-Shirt 2",
    price: 229,
    mrp: 399,
    sellerId: "660d0e9aebfab05056c0dba5",
    brand: "Adidas",
    category: "657dbe515fa71e5ed0e4fc61",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1702741589/l-st-theboys-black-smartees-original-imagnqszzzzyuzru_lvxmd8.jpg",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1702741589/l-st-theboys-black-smartees-original-imagnqszzzzyuzru_lvxmd8.jpg",
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    stock: 100,
    tags: ["Tshirt", "Adidas", "Men", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "SM",
        available: true,
      },
      {
        size: "MD",
        available: true,
      },
      {
        size: "XL",
        available: true,
      },
      {
        size: "XXL",
        available: true,
      },
    ],
    instaId: "C09U4o5Bj2S",
    weight: "500",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230de0",
    name: "Men Asics Shoes",
    price: 2099,
    mrp: 2399,
    sellerId: "660d0e9aebfab05056c0dba5",
    brand: "Asics",
    category: "657dbf7a5fa71e5ed0e4fc85",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703068528/men_shoes_rxwom9.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703068528/men_shoes_rxwom9.webp",
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    stock: 96,
    tags: ["Shoes", "Ascics", "Men", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "6",
        available: true,
      },
      {
        size: "7",
        available: true,
      },
      {
        size: "8",
        available: true,
      },
      {
        size: "9",
        available: true,
      },
    ],
    instaId: "C03bi8fJ8uw",
    weight: "300",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230de4",
    name: "Women Tshirt",
    price: 289,
    mrp: 399,
    sellerId: "660d0e9aebfab05056c0dba5",
    brand: "Adidas",
    category: "657dc03c5fa71e5ed0e4fc9d",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703069425/women_shirts_cf5vtk.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703069425/women_shirts_cf5vtk.webp",
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    stock: 100,
    tags: ["Tshirt", "Adidas", "Women", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "SM",
        available: true,
      },
      {
        size: "MD",
        available: true,
      },
      {
        size: "XL",
        available: true,
      },
      {
        size: "XXL",
        available: true,
      },
    ],
    instaId: "C09U4o5Bj2S",
    weight: "300",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
  {
    _id: "65db2b4bbe39eb18d4230de1",
    name: "Women Reebok Shoes",
    price: 2099,
    mrp: 2399,
    sellerId: "660d0e9aebfab05056c0dba5",
    brand: "Reebok",
    category: "657dc18f5fa71e5ed0e4fcdc",
    images: [
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703068731/women_Soes_x2cktu.webp",
      "https://res.cloudinary.com/drchnavue/image/upload/q_auto/v1703068731/women_Soes_x2cktu.webp",
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    stock: 100,
    tags: ["Shoes", "Reebok", "Men", "Fashion"],
    colors: [
      {
        name: "Breaker Bay",
        code: "#6AA39C",
        available: true,
      },
      {
        name: "Malibu",
        code: "#6BDCFF",
        available: true,
      },
      {
        name: "Purple Heart",
        code: "#5D30DD",
        available: true,
      },
      {
        name: "Viola",
        code: "#C886A9",
        available: true,
      },
    ],
    sizes: [
      {
        size: "6",
        available: true,
      },
      {
        size: "7",
        available: true,
      },
      {
        size: "8",
        available: true,
      },
      {
        size: "9",
        available: true,
      },
    ],
    instaId: "C03bi8fJ8uw",
    weight: "300",
    length: "10",
    breadth: "10",
    height: "10",
    isDeleted: false,
  },
];

const referralToBeInserted = [
  {
    _id: "660903da645032aa7d8be359",
    referringUser: "65c1f686df560ddb338a8016",
    referredSeller: "6582baa498f7bc90135101ff",
    amount: 1000,
    status: false,
    onboarded: true,
    isDeleted: false,
  },
  {
    _id: "66067218e1a95445db590959",
    referringUser: "65e07bb893c5f94ed340fff9",
    referredSeller: "660d0e9aebfab05056c0dba5",
    amount: 500,
    status: false,
    onboarded: true,
    isDeleted: false,
  },
];

const bannerToBeInserted = [
  {
    _id: "65c63eb639ac937da3ab5318",
    images: [
      {
        desktop: {
          url: "https://utfs.io/f/af79c62c-3f6a-4202-9617-8215aceb0f1f-1e.png",
          height: 300,
          width: 1600,
        },
        mobile: {
          url: "https://utfs.io/f/65b1ff3e-c894-492c-a254-a3a544856196-1f.png",
          height: 210,
          width: 480,
        },
      },
    ],
    redirectLink:
      "https://twitter.com/search?q=%221%20Cr%22&src=trend_click&vertical=trends",
    sellerId: "6582baa498f7bc90135101ff",
    isDeleted: false,
  },
  {
    _id: "65cb9f134251e47ea6d6839e",
    images: [
      {
        desktop: {
          url: "https://utfs.io/f/af79c62c-3f6a-4202-9617-8215aceb0f1f-1e.png",
          height: 300,
          width: 1600,
        },
        mobile: {
          url: "https://utfs.io/f/65b1ff3e-c894-492c-a254-a3a544856196-1f.png",
          height: 210,
          width: 480,
        },
      },
    ],
    redirectLink:
      "https://twitter.com/search?q=%221%20Cr%22&src=trend_click&vertical=trends",
    sellerId: "6582baa498f7bc90135101ff",
    isDeleted: true,
  },
  {
    _id: "65d9aea51a4ec67e2689d0a8",
    images: [
      {
        desktop: {
          url: "https://utfs.io/f/af79c62c-3f6a-4202-9617-8215aceb0f1f-1e.png",
          height: 300,
          width: 1600,
        },
        mobile: {
          url: "https://utfs.io/f/65b1ff3e-c894-492c-a254-a3a544856196-1f.png",
          height: 210,
          width: 480,
        },
      },
    ],
    redirectLink:
      "https://twitter.com/search?q=%221%20Cr%22&src=trend_click&vertical=trends",
    sellerId: "660d0e9aebfab05056c0dba5",
    isDeleted: false,
  },
  {
    _id: "65e6cc5576fd3b9d1a33e45f",
    images: [
      {
        desktop: {
          url: "https://utfs.io/f/af79c62c-3f6a-4202-9617-8215aceb0f1f-1e.png",
          height: 300,
          width: 1600,
        },
        mobile: {
          url: "https://utfs.io/f/65b1ff3e-c894-492c-a254-a3a544856196-1f.png",
          height: 210,
          width: 480,
        },
      },
    ],
    redirectLink:
      "https://twitter.com/search?q=%221%20Cr%22&src=trend_click&vertical=trends",
    sellerId: "660d0e9aebfab05056c0dba5",
    isDeleted: true,
  },
];

const sellerRequestToInserted = [
  {
    _id: "65c1f686df560ddb338a8016",
    seller_name: "Deepak Sharma",
    store_address: "VPO Nidani Jind",
    email: "uddibhardwaj08+943@gmail.com",
    phone: "7015713717",
    monthly_orders: "1000+",
    status: false,
  },
];

const contactToBeInserted = [
  {
    _id: "65c4db902f376f6e0169d6c8",
    name: "Deepak Sharma",
    email: "uddibhardwaj08@gmail.com",
    phone: "7015713717",
    subject: "Want to become a seller",
    message: "I want to become a seller how can i get",
    status: true,
  },
];

const ticketsToBeInserted = [
  {
    _id: "65cb0eff77a0c00c4d88c0de",
    seller: "6582baa498f7bc90135101ff",
    type: "Technical",
    subject: "Got some issue while login ",
    description: "<p>This is dummy for now upated</p><p><br></p>",
    closed: false,
    isDeleted: false,
    replies: [
      {
        from: "6582baa498f7bc90135101ff",
        message: "Hii",
        time: "13-02-2024  12:13PM",
        _id: "65cb0f8f77a0c00c4d88c108",
      },
      {
        from: "65b63e807f45a061fbee13ac",
        message: "hey",
        time: "13-02-2024  12:14PM",
        _id: "65cb0fe377a0c00c4d88c115",
      },
    ],
  },
];

const transactionsToBeInserted = [
  {
    _id: "65b781dcd7ca10b951b90449",
    seller: "6582baa498f7bc90135101ff",
    transactionId: "89ASDFSDAF7654",
    amount: 50000,
    from: "2024-01-18T18:30:00.000Z",
    to: "2024-01-20T18:30:00.000Z",
    createdAt: "2024-01-29T10:45:48.507Z",
    isDeleted: false,
  },
  {
    _id: "66063da441b66ebc19d60852",
    seller: "660d0e9aebfab05056c0dba5",
    transactionId: "JDJOIJE4WOIRNF",
    amount: 56000,
    from: "2024-01-18T18:30:00.000Z",
    to: "2024-01-20T18:30:00.000Z",
    createdAt: "2024-01-29T10:45:48.507Z",
    isDeleted: false,
  },
];

const orderToBeInerted = [
  {
    _id: "65c6f55a32626f2ac9ec8487",
    customerId: "65c1f686df560ddb338a8016",
    sellerId: "6582baa498f7bc90135101ff",
    addressId: "65c1f686df560ddb338a8017",
    orderItems: [
      {
        productId: "65db2b4bbe39eb18d4230ddd",
        color: "white",
        size: "7",
        quantity: 2,
        amount: 1000,
      },
    ],
    totalAmount: 1090,
    shipping: 20,
    discount: 50,
    courior: "Local",
    note: "",
    order: {
      order_id: 3351555,
      shipment_id: 1929242,
      awb_number: "59632220664",
      courier_id: "5",
      courier_name: "Bluedart",
      status: "booked",
      additional_info: "BOM / TEC",
      payment_type: "cod",
      label:
        "http://nimubs-assets.s3.amazonaws.com/labels/20210127140158-79.pdf",
    },
    order_id: generateOrderId(),
    payment: false,
    status: "Received",
    charge: 20,
    date: getTodaysDate(),
    isDeleted: false,
  },
  {
    _id: "6602fd8af6919f0306712ea1",
    customerId: "65e07bb893c5f94ed340fff9",
    sellerId: "660d0e9aebfab05056c0dba5",
    addressId: "65f3cbd8d2d18d9b42f38bef",
    orderItems: [
      {
        productId: "65db2b4bbe39eb18d4230de4",
        color: "white",
        size: "7",
        quantity: 2,
        amount: 1000,
      },
    ],
    totalAmount: 1090,
    shipping: 20,
    discount: 50,
    courior: "Local",
    note: "",
    order: {
      order_id: 3351555,
      shipment_id: 1929242,
      awb_number: "59632220664",
      courier_id: "5",
      courier_name: "Bluedart",
      status: "booked",
      additional_info: "BOM / TEC",
      payment_type: "cod",
      label:
        "http://nimubs-assets.s3.amazonaws.com/labels/20210127140158-79.pdf",
    },
    order_id: generateOrderId(),
    payment: false,
    status: "Received",
    charge: 20,
    date: getTodaysDate(),
    isDeleted: false,
  },
];

const couponsToBeInerted = [
  {
    _id: "6587e67bc3ec969b5ef3c12d",
    code: "FLAT10",
    discount: 5,
    discount_type: "percentage",
    seller: "6582baa498f7bc90135101ff",
    isDeleted: false,
  },
  {
    _id: "6606e4bb9f519c7ed81c0ab7",
    code: "FLAT10",
    discount: 5,
    discount_type: "percentage",
    seller: "660d0e9aebfab05056c0dba5",
    isDeleted: false,
  },
];

async function seedAdmin(adminToBeInserted) {
  try {
    for (let i = 0; i < adminToBeInserted.length; i++) {
      const admin = adminToBeInserted[i];
      const existingAdmin = await Admin.findById(admin?._id);
      if (existingAdmin) {
        continue;
      }

      const newAdmin = new Admin(admin);
      await dbService.create(Admin, newAdmin);
    }
  } catch (error) {
    console.log("User seeder failed due to ", error.message);
  }
}

async function seedUser(usersToBeInserted) {
  try {
    for (let i = 0; i < usersToBeInserted.length; i++) {
      const user = usersToBeInserted[i];
      const existingUser = await User.findById(user?._id);
      if (existingUser) {
        continue;
      }
      const newUser = new User(user);
      await dbService.create(User, newUser);
    }
  } catch (error) {
    console.log("User seeder failed due to ", error.message);
  }
}

async function seedCategories(categoriesToBeInserted) {
  try {
    for (let i = 0; i < categoriesToBeInserted.length; i++) {
      const category = categoriesToBeInserted[i];
      const existingCategory = await Category.findById(category?._id);
      if (existingCategory) {
        continue;
      }
      const newCategory = new Category(category);
      await dbService.create(Category, newCategory);
    }
  } catch (error) {
    console.log("Category seeder failed due to ", error.message);
  }
}

async function seedSellers(sellersToBeInserted) {
  try {
    for (let i = 0; i < sellersToBeInserted.length; i++) {
      const seller = sellersToBeInserted[i];
      const existingUser = await Seller.findById(seller?._id);
      if (existingUser) {
        continue;
      }

      const newSeller = new Seller(seller);
      await dbService.create(Seller, newSeller);
    }
  } catch (error) {
    console.log("Seller seeder failed due to ", error.message);
  }
}

async function seedProducts(productsToBeInserted) {
  try {
    for (let i = 0; i < productsToBeInserted.length; i++) {
      const product = productsToBeInserted[i];
      const existingProduct = await Product.findById(product?._id);
      if (existingProduct) {
        continue;
      }
      const newProduct = new Product(product);
      await dbService.create(Product, newProduct);
    }
  } catch (error) {
    console.log("Products seeder failed due to ", error.message);
  }
}

async function seedReferrals(referralToBeInserted) {
  try {
    for (let i = 0; i < referralToBeInserted.length; i++) {
      const referral = referralToBeInserted[i];
      const existingReferral = await Referral.findById(referral?._id);
      if (existingReferral) {
        continue;
      }
      const newProduct = new Referral(referral);
      await dbService.create(Referral, newProduct);
    }
  } catch (error) {
    console.log("Referral seeder failed due to ", error.message);
  }
}

async function seedBanners(bannerToBeInserted) {
  try {
    for (let i = 0; i < bannerToBeInserted.length; i++) {
      const banners = bannerToBeInserted[i];
      const existingBanner = await Banner.findById(banners?._id);
      if (existingBanner) {
        continue;
      }
      const newBanner = new Banner(banners);
      await dbService.create(Banner, newBanner);
    }
  } catch (error) {
    console.log("Banner seeder failed due to ", error.message);
  }
}

async function seedSellerRequest(sellerRequestToInserted) {
  try {
    for (let i = 0; i < sellerRequestToInserted.length; i++) {
      const seller = sellerRequestToInserted[i];
      const existingSeller = await SellerRequest.findById(seller?._id);
      if (existingSeller) {
        continue;
      }
      const newRequest = new SellerRequest(seller);
      await dbService.create(SellerRequest, newRequest);
    }
  } catch (error) {
    console.log("Seller Request seeder failed due to ", error.message);
  }
}

async function seedContacts(contactToBeInserted) {
  try {
    for (let i = 0; i < contactToBeInserted.length; i++) {
      const contact = contactToBeInserted[i];
      const existingContact = await Contact.findById(contact?._id);
      if (existingContact) {
        continue;
      }
      const newContact = new Contact(contact);
      await dbService.create(Contact, newContact);
    }
  } catch (error) {
    console.log("Contact seeder failed due to ", error.message);
  }
}

async function seedTickets(ticketsToBeInserted) {
  try {
    for (let i = 0; i < ticketsToBeInserted.length; i++) {
      const ticket = ticketsToBeInserted[i];
      const existingTickets = await Tickets.findById(ticket?._id);
      if (existingTickets) {
        continue;
      }
      const newTicket = new Tickets(ticket);
      await dbService.create(Tickets, newTicket);
    }
  } catch (error) {
    console.log("Tickets seeder failed due to ", error.message);
  }
}

async function seedTransaction(transactionsToBeInserted) {
  try {
    for (let i = 0; i < transactionsToBeInserted.length; i++) {
      const transaction = transactionsToBeInserted[i];
      const existingTransaction = await Transaction.findById(transaction?._id);
      if (existingTransaction) {
        continue;
      }
      const newTransaction = new Transaction(transaction);
      await dbService.create(Transaction, newTransaction);
    }
  } catch (error) {
    console.log("Tickets seeder failed due to ", error.message);
  }
}

async function seedOrders(orderToBeInerted) {
  try {
    for (let i = 0; i < orderToBeInerted.length; i++) {
      const order = orderToBeInerted[i];
      const existingOrder = await Order.findById(order?._id);
      if (existingOrder) {
        continue;
      }
      const newOrder = new Order(order);
      await dbService.create(Order, newOrder);
    }
  } catch (error) {
    console.log("Order seeder failed due to ", error.message);
  }
}

async function seedCoupon(couponsToBeInerted) {
  try {
    for (let i = 0; i < couponsToBeInerted.length; i++) {
      const coupons = couponsToBeInerted[i];
      const existingCoupon = await Coupon.findById(coupons?._id);
      if (existingCoupon) {
        continue;
      }
      const newCoupon = new Coupon(coupons);
      await dbService.create(Coupon, newCoupon);
    }
  } catch (error) {
    console.log("Coupon seeder failed due to ", error.message);
  }
}

async function seedData() {
  await seedUser(usersToBeInserted);
  await seedCategories(categoriesToBeInserted);
  await seedSellers(sellersToBeInserted);
  await seedProducts(productsToBeInserted);
  await seedReferrals(referralToBeInserted);
  await seedAdmin(adminToBeInserted);
  await seedBanners(bannerToBeInserted);
  await seedSellerRequest(sellerRequestToInserted);
  await seedContacts(contactToBeInserted);
  await seedTickets(ticketsToBeInserted);
  await seedTransaction(transactionsToBeInserted);
  await seedOrders(orderToBeInerted);
  await seedCoupon(couponsToBeInerted);
}
module.exports = seedData;
