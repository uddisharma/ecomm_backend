const mongoose = require("mongoose");
const uri = "mongodb://127.0.0.1:27017/EcomDb_test";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;

db.once("open", () => {
  console.log("Connection Successful");
});

db.on("error", () => {
  console.log("Error in mongodb connection");
});
