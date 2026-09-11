const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const aiRoutes = require("./routes/aiRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api", aiRoutes);
app.use("/api", complaintRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CivicPulse AI Backend is running!"
  });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 CivicPulse backend running on port ${PORT}`);
});