const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema;
const items = new UsersSchema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, default: null },
  avatar: { type: String, required: true },
  mrp: { type: Number, default: null },
  ratings: { type: Number, default: null },
});

module.exports = mongoose.model("items", items);
