const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ user_email: "admin@fundspark.com" });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    await User.create({
      display_name: "Admin",
      user_email: "admin@fundspark.com",
      photo_url: "https://randomuser.me/api/portraits/lego/1.jpg",
      password: hashedPassword,
      role: "admin",
      credits: 0,
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@fundspark.com");
    console.log("Password: Admin@123");
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
  }
};

module.exports = seedAdmin;
