const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const postmanToOpenApi = require("postman-to-openapi");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
require("./config/db");
const passport = require("passport");
require("./jobs/index");
dotenv.config({ path: ".env" });
global.__basedir = __dirname;

let logger = require("morgan");
const { adminPassportStrategy } = require("./config/adminPassportStrategy");
const { devicePassportStrategy } = require("./config/devicePassportStrategy");
const { clientPassportStrategy } = require("./config/clientPassportStrategy");
const rateLimit = require("express-rate-limit");
const Order = require("./model/order");

const app = express();

//cors
const corsOptions = { origin: process.env.ALLOW_ORIGIN };
app.use(cors(corsOptions));

//rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);

//template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(require("./utils/response/responseHandler"));

//all routes
const routes = require("./routes");

adminPassportStrategy(passport);
devicePassportStrategy(passport);
clientPassportStrategy(passport);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

//swagger Documentation
postmanToOpenApi(
  "postman/postman-collection.json",
  path.join("postman/swagger.yml"),
  { defaultTag: "General" }
)
  .then((data) => {
    let result = YAML.load("postman/swagger.yml");
    result.servers[0].url = "/";
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(result));
  })
  .catch((e) => {
    console.log("Swagger Generation stopped due to some error");
  });

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/webhook",async (req, res) => {
  const {
    amount,
    client_txn_id,
    createdAt,
    customer_vpa,
    id,
    remark,
    status,
    txnAt,
    upi_txn_id,
  } = req.body;
  const payment = {
    id: upi_txn_id,
    method: "upi",
    others: {
      id,
      client_txn_id,
      customer_vpa,
      amount,
      status,
      remark,
      createdAt,
      txnAt,
    },
  };
  if (status) {
    try {
      const updatedOrder =await Order.findByIdAndUpdate(client_txn_id, {
        payment: status,
        paymentData: payment,
      });
      if (!updatedOrder) {
        return res.recordNotFound();
      }
      return res.success({ data: "payment accpected" });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  } else {
    try {
      const updatedOrder =await Order.findByIdAndDelete(client_txn_id);
      if (!updatedOrder) {
        return res.recordNotFound();
      }
      return res.success({ data: "payment not done" });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  }
});

//global catch
app.use((err, req, res, next) => {
  return res.send("Somehting up with our server");
});

//seeding and server starting
if (process.env.NODE_ENV !== "test") {
  // const seeder = require("./seeders");
  // seeder().then(() => {
  //   console.log("Seeding done.");
  // });

  app.listen(process.env.PORT, () => {
    console.log(`your application is running on ${process.env.PORT}`);
  });
} else {
  module.exports = app;
}
