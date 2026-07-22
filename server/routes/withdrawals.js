const express = require("express");
const router = express.Router();
const Withdrawal = require("../models/Withdrawal");
const Campaign = require("../models/Campaign");
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// Create withdrawal request
router.post("/", verifyToken, verifyRole("creator"), async (req, res) => {
  try {
    const {
      withdrawal_credit,
      withdrawal_amount,
      payment_system,
      account_number,
    } = req.body;

    // Get total raised for this creator
    const campaigns = await Campaign.find({ creator_email: req.user.email });
    const totalRaised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);

    if (withdrawal_credit > totalRaised) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    const user = await require("../models/User").findOne({ user_email: req.user.email });

    const withdrawal = new Withdrawal({
      creator_email: req.user.email,
      creator_name: user.display_name,
      withdrawal_credit,
      withdrawal_amount,
      payment_system,
      account_number,
      withdraw_date: new Date(),
      status: "pending",
    });

    await withdrawal.save();
    res.status(201).json({ message: "Withdrawal request submitted", withdrawal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get pending withdrawals (admin)
router.get("/pending", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: "pending" }).sort({
      withdraw_date: -1,
    });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Approve withdrawal (admin)
router.put("/approve/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    // Decrease raised credits from creator's campaigns
    const campaigns = await Campaign.find({ creator_email: withdrawal.creator_email });
    let remainingCredits = withdrawal.withdrawal_credit;

    for (const campaign of campaigns.sort((a, b) => a.amount_raised - b.amount_raised)) {
      if (remainingCredits <= 0) break;
      const deduct = Math.min(campaign.amount_raised, remainingCredits);
      await Campaign.findByIdAndUpdate(campaign._id, {
        $inc: { amount_raised: -deduct },
      });
      remainingCredits -= deduct;
    }

    // Notify creator
    await new Notification({
      message: `Your withdrawal of $${withdrawal.withdrawal_amount} has been processed successfully!`,
      toEmail: withdrawal.creator_email,
      actionRoute: "/dashboard/creator/withdrawals",
    }).save();

    res.json({ message: "Withdrawal approved", withdrawal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get withdrawal history for creator
router.get("/my-withdrawals", verifyToken, verifyRole("creator"), async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      creator_email: req.user.email,
    }).sort({ withdraw_date: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
