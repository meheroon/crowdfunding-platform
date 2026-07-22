const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const { display_name, user_email, photo_url, password, role } = req.body;

    const existingUser = await User.findOne({ user_email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const credits = role === "supporter" ? 50 : 20;

    const user = new User({
      display_name,
      user_email,
      photo_url,
      password: hashedPassword,
      role,
      credits,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.user_email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        display_name: user.display_name,
        user_email: user.user_email,
        photo_url: user.photo_url,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { user_email, password } = req.body;

    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.user_email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        display_name: user.display_name,
        user_email: user.user_email,
        photo_url: user.photo_url,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Google Sign-In
router.post("/google-login", async (req, res) => {
  try {
    const { display_name, user_email, photo_url, google_id } = req.body;

    let user = await User.findOne({ user_email });

    if (!user) {
      user = new User({
        display_name,
        user_email,
        photo_url,
        google_id,
        role: "supporter",
        credits: 50,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.user_email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        display_name: user.display_name,
        user_email: user.user_email,
        photo_url: user.photo_url,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
