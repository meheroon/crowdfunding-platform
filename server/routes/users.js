const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// Get all users (admin only)
router.get("/", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ user_email: req.user.email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user role (admin only)
router.put("/role/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user (admin only)
router.delete("/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user credits
router.put("/credits/:email", verifyToken, async (req, res) => {
  try {
    const { credits } = req.body;
    const user = await User.findOneAndUpdate(
      { user_email: req.params.email },
      { $inc: { credits } },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get admin stats
router.get("/admin-stats", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const totalSupporters = await User.countDocuments({ role: "supporter" });
    const totalCreators = await User.countDocuments({ role: "creator" });
    const totalCredits = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$credits" } } },
    ]);

    res.json({
      totalSupporters,
      totalCreators,
      totalCredits: totalCredits[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
