const express = require("express");
const router = express.Router();
const {
  getSchoolYears,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear,
  getSections,
  createSection,
  updateSection,
  deleteSection,
  getAcademicOptions,
} = require("../controllers/academicController");
const { protect, adminOrFaculty } = require("../middlewares/authMiddleware");

router.use(protect, adminOrFaculty);

router.get("/options", getAcademicOptions);

router.route("/school-years").get(getSchoolYears).post(createSchoolYear);
router.route("/school-years/:id").put(updateSchoolYear).delete(deleteSchoolYear);

router.route("/sections").get(getSections).post(createSection);
router.route("/sections/:id").put(updateSection).delete(deleteSection);

module.exports = router;