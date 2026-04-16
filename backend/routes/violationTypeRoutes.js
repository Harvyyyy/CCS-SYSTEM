const express = require("express");
const router = express.Router();
const {
  getViolationTypes,
  createViolationType,
  updateViolationType,
  deleteViolationType,
} = require("../controllers/violationController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.use(protect, admin);

router.route("/")
  .get(getViolationTypes)
  .post(createViolationType);

router.route("/:id")
  .put(updateViolationType)
  .delete(deleteViolationType);

module.exports = router;