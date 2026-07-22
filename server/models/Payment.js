const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  credits_purchased: {
    type: Number,
    required: true,
  },
  package_name: {
    type: String,
    required: true,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
  stripe_session_id: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["completed", "pending", "failed"],
    default: "completed",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
