const express = require("express");
const { createComplaint } = require("../controllers/complaintController");

const router = express.Router();

router.post("/generate-complaint", createComplaint);

module.exports = router;