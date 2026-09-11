const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const aiRoutes = require("./routes/aiRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const duplicateRoutes = require("./routes/duplicateRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoutes);
app.use("/api", complaintRoutes);
app.use("/api", duplicateRoutes);
app.use("/api", verificationRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CivicPulse AI Backend is running!"
  });
});

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`🚀 CivicPulse backend running on port ${PORT}`);
});