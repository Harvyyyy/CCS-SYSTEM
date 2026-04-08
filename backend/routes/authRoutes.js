const express = require("express");
const router = express.Router();
const { authUser, registerUser, getUserProfile, changePassword } = require("../controllers/authController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Only logged in admins can register new users
router.post("/register", protect, admin, registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;