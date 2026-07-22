const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/contributions", require("./routes/contributions"));
app.use("/api/withdrawals", require("./routes/withdrawals"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/reports", require("./routes/reports"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Crowdfunding API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
