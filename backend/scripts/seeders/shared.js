const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const User = require("../../models/User");
const Course = require("../../models/Course");

dotenv.config();

const connectAndRun = async (runner) => {
  await connectDB();

  try {
    return await runner();
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

const upsertUser = async (userData) => {
  const existing = await User.findOne({ userId: userData.userId });

  if (existing) {
    existing.name = userData.name;
    existing.email = userData.email;
    existing.role = userData.role;
    existing.accountStatus = userData.accountStatus;
    await existing.save();
    return existing;
  }

  return User.create(userData);
};

const upsertCourse = async (courseData) => {
  return Course.findOneAndUpdate(
    { code: courseData.code },
    courseData,
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
};

module.exports = {
  connectAndRun,
  upsertUser,
  upsertCourse,
};