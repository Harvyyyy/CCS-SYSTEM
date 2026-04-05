const express = require("express");
const router = express.Router();
const User = require("../models/user");

// CREATE
router.post("/", async (req, res) => {
  const user = new User(req.body);
  const savedUser = await user.save();
  res.json(savedUser);
});

// READ
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedUser);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;