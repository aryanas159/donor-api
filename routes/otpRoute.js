const express = require("express");
const router = express.Router();
const { generateOtp, verifyOtp } = require("../controllers/otpController");

router.post("/generate", generateOtp);
router.post("/verify", verifyOtp);

module.exports = router;
