const AdminProfile = require("../models/AdminProfile");
const FacultyProfile = require("../models/FacultyProfile");
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

// @desc    Get logged-in user profile based on role
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const role = req.user.role;
    let profile;

    if (role === "admin") {
      profile = await AdminProfile.findOne({ user: req.user._id }).populate("user", "userId email name");
    } else if (role === "faculty") {
      profile = await FacultyProfile.findOne({ user: req.user._id }).populate("user", "userId email name");
    } else if (role === "student") {
      profile = await StudentProfile.findOne({ user: req.user._id }).populate("user", "userId email name");
    }

    if (!profile) {
      return res.status(404).json({ message: `${role} profile not found` });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update logged-in user profile based on role
// @route   PUT /api/profile/me
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    const role = req.user.role;
    let profile;

    if (role === "admin") {
      profile = await AdminProfile.findOne({ user: req.user._id });
    } else if (role === "faculty") {
      profile = await FacultyProfile.findOne({ user: req.user._id });
    } else if (role === "student") {
      profile = await StudentProfile.findOne({ user: req.user._id });
    }

    if (!profile) {
      return res.status(404).json({ message: `${role} profile not found` });
    }

    // Role-specific updates
    if (role === "admin") {
      const { fullName, position, contactNumber, email } = req.body;
      if (fullName) profile.fullName = fullName;
      if (position !== undefined) profile.position = position;
      if (contactNumber !== undefined) profile.contactNumber = contactNumber;
      
      if (email) {
        const user = await User.findById(req.user._id);
        if (user) {
          user.email = email;
          await user.save();
        }
      }
    } else if (role === "faculty") {
      const { firstName, middleName, lastName, gender, department, position, contactNumber, email } = req.body;
      if (firstName !== undefined) profile.firstName = firstName;
      if (middleName !== undefined) profile.middleName = middleName;
      if (lastName !== undefined) profile.lastName = lastName;
      if (gender !== undefined) profile.gender = gender;
      if (department !== undefined) profile.department = department;
      if (position !== undefined) profile.position = position;
      if (contactNumber !== undefined) profile.contactNumber = contactNumber;

      if (email) {
        const user = await User.findById(req.user._id);
        if (user) {
          user.email = email;
          await user.save();
        }
      }
    } else if (role === "student") {
      const {
        firstName, middleName, lastName, gender, yearLevel, program,
        academicStatus, height, weight, contactNumber,
        emergencyContactName, emergencyContactNumber, emergencyContactRelation,
        yearGraduated, email
      } = req.body;

      if (firstName !== undefined) profile.firstName = firstName;
      if (middleName !== undefined) profile.middleName = middleName;
      if (lastName !== undefined) profile.lastName = lastName;
      if (gender !== undefined) profile.gender = gender;
      if (yearLevel !== undefined) profile.yearLevel = yearLevel;
      if (program !== undefined) profile.program = program;
      if (academicStatus !== undefined) profile.academicStatus = academicStatus;
      if (height !== undefined) profile.height = height;
      if (weight !== undefined) profile.weight = weight;
      if (contactNumber !== undefined) profile.contactNumber = contactNumber;
      if (emergencyContactName !== undefined) profile.emergencyContactName = emergencyContactName;
      if (emergencyContactNumber !== undefined) profile.emergencyContactNumber = emergencyContactNumber;
      if (emergencyContactRelation !== undefined) profile.emergencyContactRelation = emergencyContactRelation;
      if (yearGraduated !== undefined) profile.yearGraduated = yearGraduated;

      if (email) {
        const user = await User.findById(req.user._id);
        if (user) {
          user.email = email;
          await user.save();
        }
      }
    }

    const updatedProfile = await profile.save();
    const populated = await updatedProfile.populate("user", "userId email name");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};