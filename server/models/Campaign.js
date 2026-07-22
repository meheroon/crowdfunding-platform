const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  campaign_title: {
    type: String,
    required: true,
    trim: true,
  },
  campaign_story: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Technology", "Art", "Community", "Health", "Education", "Environment", "Business", "Other"],
  },
  funding_goal: {
    type: Number,
    required: true,
  },
  minimum_Contribution: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  reward_info: {
    type: String,
    required: true,
  },
  campaign_image_url: {
    type: String,
    required: true,
  },
  amount_raised: {
    type: Number,
    default: 0,
  },
  supporter_count: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  creator_email: {
    type: String,
    required: true,
  },
  creator_name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
