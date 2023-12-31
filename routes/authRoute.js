const express = require("express");
const router = express.Router();
const {
	registerDonor,
	loginDonor,
	changeStatus,
	getClosestDonors,
	getDonor,
	changePassword
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerDonor);
router.post("/login", loginDonor);
router.patch("/update", authMiddleware, changeStatus);
router.patch("/changePassword", changePassword);
router.get("/closestDonors", getClosestDonors);
router.get("/:id", getDonor);
module.exports = router;
