const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habits");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();
app.use(express.json());
app.use(cors({
origin: "*",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API running" });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});