const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");
const Campaign = require("../models/Campaign");
const Notification = require("../models/Notification");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// Create contribution
router.post("/", verifyToken, verifyRole("supporter"), async (req, res) => {
  try {
    const {
      campaign_id,
      campaign_title,
      Contribution_amount,
      creator_name,
      creator_email,
    } = req.body;

    const user = await User.findOne({ user_email: req.user.email });

    if (user.credits < Contribution_amount) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    const campaign = await Campaign.findById(campaign_id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const contribution = new Contribution({
      campaign_id,
      campaign_title,
      Contribution_amount,
      Supporter_email: req.user.email,
      Supporter_name: user.display_name,
      creator_name,
      creator_email,
      current_date: new Date(),
      status: "pending",
    });

    await contribution.save();

    // Deduct credits from supporter
    await User.findOneAndUpdate(
      { user_email: req.user.email },
      { $inc: { credits: -Contribution_amount } }
    );

    // Notify creator
    await new Notification({
      message: `${user.display_name} contributed ${Contribution_amount} credits to "${campaign_title}"`,
      toEmail: creator_email,
      actionRoute: "/dashboard/creator",
    }).save();

    res.status(201).json({ message: "Contribution submitted", contribution });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get contributions by supporter
router.get("/my-contributions", verifyToken, verifyRole("supporter"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Contribution.countDocuments({ Supporter_email: req.user.email });
    const contributions = await Contribution.find({ Supporter_email: req.user.email })
      .sort({ current_date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      contributions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get pending contributions for creator
router.get("/pending-contributions", verifyToken, verifyRole("creator"), async (req, res) => {
  try {
    const contributions = await Contribution.find({
      creator_email: req.user.email,
      status: "pending",
    }).sort({ current_date: -1 });
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Approve contribution
router.put("/approve/:id", verifyToken, verifyRole("creator"), async (req, res) => {
  try {
    const contribution = await Contribution.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    // Update campaign raised amount
    await Campaign.findByIdAndUpdate(contribution.campaign_id, {
      $inc: {
        amount_raised: contribution.Contribution_amount,
        supporter_count: 1,
      },
    });

    // Notify supporter
    await new Notification({
      message: `Your Contribution of ${contribution.Contribution_amount} credits to ${contribution.campaign_title} was approved by ${contribution.creator_name}`,
      toEmail: contribution.Supporter_email,
      actionRoute: "/dashboard/supporter",
    }).save();

    res.json({ message: "Contribution approved", contribution });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Reject contribution
router.put("/reject/:id", verifyToken, verifyRole("creator"), async (req, res) => {
  try {
    const contribution = await Contribution.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    // Refund credits to supporter
    await User.findOneAndUpdate(
      { user_email: contribution.Supporter_email },
      { $inc: { credits: contribution.Contribution_amount } }
    );

    // Notify supporter
    await new Notification({
      message: `Your Contribution of ${contribution.Contribution_amount} credits to ${contribution.campaign_title} was rejected by ${contribution.creator_name}`,
      toEmail: contribution.Supporter_email,
      actionRoute: "/dashboard/supporter",
    }).save();

    res.json({ message: "Contribution rejected and refunded", contribution });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get contribution stats for supporter
router.get("/stats", verifyToken, verifyRole("supporter"), async (req, res) => {
  try {
    const email = req.user.email;
    const totalContributions = await Contribution.countDocuments({ Supporter_email: email });
    const pendingContributions = await Contribution.countDocuments({
      Supporter_email: email,
      status: "pending",
    });
    const approvedResult = await Contribution.aggregate([
      { $match: { Supporter_email: email, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$Contribution_amount" } } },
    ]);

    res.json({
      totalContributions,
      pendingContributions,
      totalAmountContributed: approvedResult[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
