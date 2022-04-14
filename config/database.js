const mongoose = require("mongoose");

const mongoDB = "mongodb://localhost:27017/lat-express";

// koneksi database
mongoose
  .connect(mongoDB, { useNewUrlParser: true })
  .then(() => console.log("Mongodb Connected")); //respon apabila konek

mongoose.Promise = global.Promise;

module.exports = mongoose;
