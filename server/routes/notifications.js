const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken");

// Get notifications for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ toEmail: req.user.email })
      .sort({ time: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get unread count
router.get("/unread-count", verifyToken, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      toEmail: req.user.email,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Mark as read
router.put("/mark-read/:id", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Mark all as read
router.put("/mark-all-read", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { toEmail: req.user.email, read: false },
      { read: true }
    );
    res.json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
