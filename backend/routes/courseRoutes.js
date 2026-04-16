const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.use(protect, admin);

router.route("/")
  .get(getCourses)
  .post(createCourse);

router.route("/:id")
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;