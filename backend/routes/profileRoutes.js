const express = require("express");
const router = express.Router();
const { getMyProfile, updateMyProfile } = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");

// @route   GET /api/profile/me
// @access  Private
router.get("/me", protect, getMyProfile);

// @route   PUT /api/profile/me
// @access  Private
router.put("/me", protect, updateMyProfile);

module.exports = router;