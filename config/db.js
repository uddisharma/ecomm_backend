const mongoose = require("mongoose");
const uri = "mongodb+srv://uddibhardwaj08:uddibhardwaj08@cluster0.7zyan.mongodb.net";
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
