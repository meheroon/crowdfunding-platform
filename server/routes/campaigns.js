const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Contribution = require("../models/Contribution");
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// Create campaign
router.post("/", verifyToken, verifyRole("creator"), async (req, res) => {
  try {
    const {
      campaign_title,
      campaign_story,
      category,
      funding_goal,
      minimum_Contribution,
      deadline,
      reward_info,
      campaign_image_url,
    } = req.body;

    const user = await require("../models/User").findOne({ user_email: req.user.email });

    const campaign = new Campaign({
      campaign_title,
      campaign_story,
      category,
      funding_goal,
      minimum_Contribution,
      deadline,
      reward_info,
      campaign_image_url,
      creator_email: req.user.email,
      creator_name: user.display_name,
    });

    await campaign.save();
    res.status(201).json({ message: "Campaign created successfully", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all approved campaigns (public)
router.get("/approved", async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      status: "approved",
      deadline: { $gt: new Date() },
    }).sort({ amount_raised: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get top funded campaigns
router.get("/top-funded", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "approved" })
      .sort({ amount_raised: -1 })
      .limit(6);
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get pending campaigns (admin)
router.get("/pending", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all campaigns (admin)
router.get("/all", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single campaign
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get campaigns by creator
router.get("/creator/my-campaigns", verifyToken, verifyRole("creator"), async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creator_email: req.user.email }).sort({
      deadline: -1,
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Approve campaign (admin)
router.put("/approve/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    await new Notification({
      message: `Your campaign "${campaign.campaign_title}" has been approved!`,
      toEmail: campaign.creator_email,
      actionRoute: "/dashboard/creator",
    }).save();

    res.json({ message: "Campaign approved", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Reject campaign (admin)
router.put("/reject/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    await new Notification({
      message: `Your campaign "${campaign.campaign_title}" has been rejected.`,
      toEmail: campaign.creator_email,
      actionRoute: "/dashboard/creator",
    }).save();

    res.json({ message: "Campaign rejected", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update campaign (creator)
router.put("/:id", verifyToken, verifyRole("creator"), async (req, res) => {
  try {
    const { campaign_title, campaign_story, reward_info } = req.body;
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, creator_email: req.user.email },
      { campaign_title, campaign_story, reward_info },
      { new: true }
    );
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete campaign (creator or admin)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Refund all approved contributions
    const approvedContributions = await Contribution.find({
      campaign_id: req.params.id,
      status: "approved",
    });

    for (const contribution of approvedContributions) {
      await require("../models/User").findOneAndUpdate(
        { user_email: contribution.Supporter_email },
        { $inc: { credits: contribution.Contribution_amount } }
      );
    }

    // Delete contributions
    await Contribution.deleteMany({ campaign_id: req.params.id });

    // Delete campaign
    await Campaign.findByIdAndDelete(req.params.id);

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
