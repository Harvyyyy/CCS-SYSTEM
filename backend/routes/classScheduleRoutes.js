const express = require("express");
const router = express.Router();
const {
  getClassSchedules,
  getClassScheduleById,
  getClassScheduleOptions,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
} = require("../controllers/classScheduleController");
const { protect, adminOrFaculty } = require("../middlewares/authMiddleware");

router.use(protect, adminOrFaculty);

router.get("/options", getClassScheduleOptions);

router.route("/").get(getClassSchedules).post(createClassSchedule);
router
  .route("/:id")
  .get(getClassScheduleById)
  .put(updateClassSchedule)
  .delete(deleteClassSchedule);

module.exports = router;
