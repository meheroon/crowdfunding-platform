const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const Campaign = require("../models/Campaign");
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// Create report
router.post("/", verifyToken, async (req, res) => {
  try {
    const { campaign_id, campaign_title, reason } = req.body;

    const report = new Report({
      campaign_id,
      campaign_title,
      reporter_name: req.body.reporter_name,
      reporter_email: req.user.email,
      reason,
      report_date: new Date(),
    });

    await report.save();
    res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all reports (admin)
router.get("/", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const reports = await Report.find().sort({ report_date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Resolve report (admin) - delete campaign
router.put("/resolve/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );

    // Delete the reported campaign
    await Campaign.findByIdAndDelete(report.campaign_id);

    // Notify reporter
    await new Notification({
      message: `The campaign "${report.campaign_title}" you reported has been removed.`,
      toEmail: report.reporter_email,
      actionRoute: "/dashboard/supporter",
    }).save();

    res.json({ message: "Report resolved and campaign deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Dismiss report (admin)
router.put("/dismiss/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    await Report.findByIdAndUpdate(req.params.id, { status: "dismissed" });
    res.json({ message: "Report dismissed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
