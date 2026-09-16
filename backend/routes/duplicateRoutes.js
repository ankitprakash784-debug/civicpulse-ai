const express = require("express");

const {
  checkDuplicate
} = require("../controllers/duplicateController");

const router = express.Router();

router.post("/check-duplicate", checkDuplicate);

module.exports = router;