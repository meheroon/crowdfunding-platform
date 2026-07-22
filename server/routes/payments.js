const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

// Create payment (dummy/Stripe)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { amount, credits_purchased, package_name } = req.body;

    const user = await User.findOne({ user_email: req.user.email });

    const payment = new Payment({
      user_email: req.user.email,
      user_name: user.display_name,
      amount,
      credits_purchased,
      package_name,
      payment_date: new Date(),
      status: "completed",
    });

    await payment.save();

    // Add credits to user
    await User.findOneAndUpdate(
      { user_email: req.user.email },
      { $inc: { credits: credits_purchased } }
    );

    res.status(201).json({ message: "Payment successful", payment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get payment history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ user_email: req.user.email }).sort({
      payment_date: -1,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get total payments processed (admin)
router.get("/total", verifyToken, async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({ total: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
