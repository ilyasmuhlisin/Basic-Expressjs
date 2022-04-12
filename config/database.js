const mongoose = require("mongoose");

const mongoDB = "mongodb://localhost/First_App";

// koneksi database
mongoose
  .connect(mongoDB, { useNewUrlParser: true })
  .then(() => console.log("Mongodb Connected")); //respon apabila konek

mongoose.Promise = global.Promise;

module.exports = mongoose;
