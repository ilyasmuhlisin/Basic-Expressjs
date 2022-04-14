const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// encryption bcrypt untuk password
// ketika data user disvae di mDB
UserSchema.pre("save", async function (next) {
  if (this.password) {
    // await digunakan untuk yidak melakukan save apabila proses bycript belum selesai
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
