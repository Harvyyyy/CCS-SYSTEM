const FacultyProfile = require("../models/FacultyProfile");
const User = require("../models/User");

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private/Admin
const getFaculty = async (req, res) => {
  try {
    const faculty = await FacultyProfile.find().populate("user", "userId email name");
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get faculty by ID
// @route   GET /api/faculty/:id
// @access  Private/Admin
const getFacultyById = async (req, res) => {
  try {
    const faculty = await FacultyProfile.findById(req.params.id).populate("user", "userId email name");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty profile not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a faculty profile
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res) => {
  try {
    const {
      userId, employeeIdNumber, firstName, middleName, lastName, gender,
      department, position, contactNumber, email, password
    } = req.body;

    if (!userId || !employeeIdNumber || !firstName || !lastName) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let user = await User.findOne({ userId });

    // Auto-create user if not found
    if (!user) {
      user = await User.create({
         userId,
         name: `${firstName} ${lastName}`,
         email: email || `${employeeIdNumber}@faculty.app.edu`,
         password: password || "password123",
         role: "faculty"
      });
    }

    const existingFaculty = await FacultyProfile.findOne({
      $or: [{ user: user._id }, { employeeIdNumber }],
    });
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty profile (or employee ID) already exists" });
    }

    const faculty = await FacultyProfile.create({
      user: user._id,
      employeeIdNumber,
      firstName,
      middleName,
      lastName,
      gender,
      department,
      position,
      contactNumber,
    });

    const populated = await faculty.populate("user", "userId email name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a faculty profile
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFaculty = async (req, res) => {
  try {
    const faculty = await FacultyProfile.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty profile not found" });
    }

    const {
      userId, employeeIdNumber, firstName, middleName, lastName, gender,
      department, position, contactNumber, email
    } = req.body;

    if (userId) {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(400).json({ message: "User not found for userId" });
      }
      faculty.user = user._id;
      if (email) {
        user.email = email;
        await user.save();
      }
    }

    if (employeeIdNumber) faculty.employeeIdNumber = employeeIdNumber;
    if (firstName !== undefined) faculty.firstName = firstName;
    if (middleName !== undefined) faculty.middleName = middleName;
    if (lastName !== undefined) faculty.lastName = lastName;
    if (gender !== undefined) faculty.gender = gender;
    if (department !== undefined) faculty.department = department;
    if (position !== undefined) faculty.position = position;
    if (contactNumber !== undefined) faculty.contactNumber = contactNumber;

    const updated = await faculty.save();
    const populated = await updated.populate("user", "userId email name");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a faculty profile
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFaculty = async (req, res) => {
  try {
    const faculty = await FacultyProfile.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ message: "Faculty profile not found" });
    
    // Optionally delete the user account too, but we will leave the user account intact for now
    res.json({ message: "Faculty profile deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};