const mongoose = require("mongoose");
const ViolationType = require("../models/ViolationType");
const StudentViolation = require("../models/StudentViolation");
const StudentProfile = require("../models/StudentProfile");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const getViolationTypes = async (req, res) => {
  try {
    const violationTypes = await ViolationType.find().sort({ category: 1, violationName: 1 });
    res.json(violationTypes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createViolationType = async (req, res) => {
  try {
    const { violationName, description, category } = req.body;

    if (!violationName || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await ViolationType.findOne({ violationName });
    if (existing) {
      return res.status(400).json({ message: "Violation type already exists" });
    }

    const violationType = await ViolationType.create({ violationName, description, category });
    res.status(201).json(violationType);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateViolationType = async (req, res) => {
  try {
    const violationType = await ViolationType.findById(req.params.id);
    if (!violationType) {
      return res.status(404).json({ message: "Violation type not found" });
    }

    const { violationName, description, category } = req.body;
    if (violationName !== undefined) violationType.violationName = violationName;
    if (description !== undefined) violationType.description = description;
    if (category !== undefined) violationType.category = category;

    const updated = await violationType.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteViolationType = async (req, res) => {
  try {
    const violationType = await ViolationType.findByIdAndDelete(req.params.id);
    if (!violationType) {
      return res.status(404).json({ message: "Violation type not found" });
    }

    res.json({ message: "Violation type deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getViolations = async (req, res) => {
  try {
    const violations = await StudentViolation.find()
      .populate({ path: "student", select: "studentNumber firstName middleName lastName user", populate: { path: "user", select: "userId email name" } })
      .populate("violationType")
      .populate("reportedBy", "userId email name")
      .sort({ violationDate: -1, createdAt: -1 });

    res.json(violations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getViolationById = async (req, res) => {
  try {
    const violation = await StudentViolation.findById(req.params.id)
      .populate({ path: "student", select: "studentNumber firstName middleName lastName user", populate: { path: "user", select: "userId email name" } })
      .populate("violationType")
      .populate("reportedBy", "userId email name");

    if (!violation) {
      return res.status(404).json({ message: "Violation record not found" });
    }

    res.json(violation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createViolation = async (req, res) => {
  try {
    const { student, violationType, offenseLevel, violationDate, violationTime, description, concernedPersonnel, disciplinaryAction, remarks } = req.body;

    if (!student || !violationType || !offenseLevel || !violationDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!isValidObjectId(student) || !isValidObjectId(violationType)) {
      return res.status(400).json({ message: "Invalid student or violation type" });
    }

    const studentProfile = await StudentProfile.findById(student);
    if (!studentProfile) {
      return res.status(400).json({ message: "Student not found" });
    }

    const violation = await StudentViolation.create({
      student,
      violationType,
      offenseLevel,
      violationDate,
      violationTime,
      description,
      concernedPersonnel,
      disciplinaryAction,
      remarks,
      reportedBy: req.user._id,
    });

    const populated = await violation
      .populate({ path: "student", select: "studentNumber firstName middleName lastName user", populate: { path: "user", select: "userId email name" } })
      .populate("violationType")
      .populate("reportedBy", "userId email name");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateViolation = async (req, res) => {
  try {
    const violation = await StudentViolation.findById(req.params.id);
    if (!violation) {
      return res.status(404).json({ message: "Violation record not found" });
    }

    const { student, violationType, offenseLevel, violationDate, violationTime, description, concernedPersonnel, disciplinaryAction, remarks } = req.body;

    if (student !== undefined) {
      if (!isValidObjectId(student) || !(await StudentProfile.findById(student))) {
        return res.status(400).json({ message: "Invalid student" });
      }
      violation.student = student;
    }
    if (violationType !== undefined) {
      if (!isValidObjectId(violationType)) {
        return res.status(400).json({ message: "Invalid violation type" });
      }
      violation.violationType = violationType;
    }
    if (offenseLevel !== undefined) violation.offenseLevel = offenseLevel;
    if (violationDate !== undefined) violation.violationDate = violationDate;
    if (violationTime !== undefined) violation.violationTime = violationTime;
    if (description !== undefined) violation.description = description;
    if (concernedPersonnel !== undefined) violation.concernedPersonnel = concernedPersonnel;
    if (disciplinaryAction !== undefined) violation.disciplinaryAction = disciplinaryAction;
    if (remarks !== undefined) violation.remarks = remarks;
    if (req.user?._id) violation.reportedBy = req.user._id;

    const updated = await violation.save();
    const populated = await updated
      .populate({ path: "student", select: "studentNumber firstName middleName lastName user", populate: { path: "user", select: "userId email name" } })
      .populate("violationType")
      .populate("reportedBy", "userId email name");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteViolation = async (req, res) => {
  try {
    const violation = await StudentViolation.findByIdAndDelete(req.params.id);
    if (!violation) {
      return res.status(404).json({ message: "Violation record not found" });
    }

    res.json({ message: "Violation record deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getViolationTypes,
  createViolationType,
  updateViolationType,
  deleteViolationType,
  getViolations,
  getViolationById,
  createViolation,
  updateViolation,
  deleteViolation,
};