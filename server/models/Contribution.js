const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({
  campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  campaign_title: {
    type: String,
    required: true,
  },
  Contribution_amount: {
    type: Number,
    required: true,
  },
  Supporter_email: {
    type: String,
    required: true,
  },
  Supporter_name: {
    type: String,
    required: true,
  },
  creator_name: {
    type: String,
    required: true,
  },
  creator_email: {
    type: String,
    required: true,
  },
  current_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Contribution", contributionSchema);
