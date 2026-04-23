const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

const normalizeRouter = (moduleExport, modulePath) => {
  const router = moduleExport?.default || moduleExport;
  if (typeof router !== "function") {
    throw new TypeError(
      `Route module "${modulePath}" must export an Express router function`
    );
  }
  return router;
};

const userRoutes = normalizeRouter(require("./routes/userRoutes"), "./routes/userRoutes");
const authRoutes = normalizeRouter(require("./routes/authRoutes"), "./routes/authRoutes");
const facultyRoutes = normalizeRouter(require("./routes/facultyRoutes"), "./routes/facultyRoutes");
const studentRoutes = normalizeRouter(require("./routes/studentRoutes"), "./routes/studentRoutes");
const profileRoutes = normalizeRouter(require("./routes/profileRoutes"), "./routes/profileRoutes");
const courseRoutes = normalizeRouter(require("./routes/courseRoutes"), "./routes/courseRoutes");
const medicalRecordRoutes = normalizeRouter(require("./routes/medicalRecordRoutes"), "./routes/medicalRecordRoutes");
const academicRoutes = normalizeRouter(require("./routes/academicRoutes"), "./routes/academicRoutes");
const classScheduleRoutes = normalizeRouter(require("./routes/classScheduleRoutes"), "./routes/classScheduleRoutes");
const violationRoutes = normalizeRouter(require("./routes/violationRoutes"), "./routes/violationRoutes");
const violationTypeRoutes = normalizeRouter(require("./routes/violationTypeRoutes"), "./routes/violationTypeRoutes");
const eventRoutes = normalizeRouter(require("./routes/eventRoutes"), "./routes/eventRoutes");
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/class-schedules", classScheduleRoutes);
app.use("/api/violations", violationRoutes);
app.use("/api/violation-types", violationTypeRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
