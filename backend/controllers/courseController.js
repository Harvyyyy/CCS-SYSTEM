const Course = require("../models/Course");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private/Admin
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ year: 1, sem: 1, code: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Private/Admin
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { code, desc, units, prereq, year, sem } = req.body;

    if (!code || !desc || units === undefined || year === undefined || sem === undefined) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({ message: "Course code already exists" });
    }

    const course = await Course.create({
      code,
      desc,
      units,
      prereq: prereq || "--",
      year,
      sem,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const { code, desc, units, prereq, year, sem } = req.body;

    if (code !== undefined) course.code = code;
    if (desc !== undefined) course.desc = desc;
    if (units !== undefined) course.units = units;
    if (prereq !== undefined) course.prereq = prereq;
    if (year !== undefined) course.year = year;
    if (sem !== undefined) course.sem = sem;

    const updated = await course.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};