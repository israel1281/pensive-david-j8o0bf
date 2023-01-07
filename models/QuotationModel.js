const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema({
  billingFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  billingTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCustomer",
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const Quotation = mongoose.model("Quotation", quotationSchema);

module.exports = Quotation;
