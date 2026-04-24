const STUDENT_COUNT = Number(process.env.SEED_STUDENT_COUNT || 500);
const FACULTY_COUNT = Number(process.env.SEED_FACULTY_COUNT || 24);

const FIRST_NAMES = [
  "Adrian", "Bianca", "Carlos", "Diana", "Ethan", "Frances", "Gabriel", "Hannah",
  "Ivan", "Julia", "Kevin", "Lara", "Miguel", "Nina", "Oscar", "Paula",
  "Quentin", "Rhea", "Samuel", "Tina", "Ulysses", "Vanessa", "Wesley", "Xenia",
  "Yvette", "Zach", "Aira", "Brent", "Clarisse", "Daryl", "Elijah", "Faith",
  "Gino", "Hailey", "Iris", "Jasper", "Kara", "Liam", "Mara", "Noel",
];

const LAST_NAMES = [
  "Santos", "Reyes", "Dela Cruz", "Garcia", "Mendoza", "Cruz", "Torres", "Ramos",
  "Navarro", "Bautista", "Aquino", "Castro", "Fernandez", "Gutierrez", "Villanueva",
  "Domingo", "Luna", "Padilla", "Rivera", "Salazar", "Valdez", "Yap", "Aguilar",
  "Bernardo", "Chua", "David", "Espino", "Flores", "Gonzales", "Hernandez",
];

const ADMIN_USERS = [
  {
    userId: "admin01",
    name: "Admin User",
    email: "admin@pnc.edu.ph",
    password: "password123",
    role: "admin",
    accountStatus: "active",
  },
];

const ADMIN_PROFILES = [
  {
    userId: "admin01",
    fullName: "Admin User",
    position: "System Administrator",
    contactNumber: "09170000001",
    achievements: "Institutional Data Modernization Lead",
    skills: "System Administration, Security, Data Governance",
    interests: "Academic Operations, Compliance",
  },
];

const DEFAULT_FACULTY_USERS = [
  {
    userId: "faculty01",
    name: "Maria Santos",
    email: "maria.santos@pnc.edu.ph",
    password: "password123",
    role: "faculty",
    accountStatus: "active",
  },
  {
    userId: "faculty02",
    name: "Juan Reyes",
    email: "juan.reyes@pnc.edu.ph",
    password: "password123",
    role: "faculty",
    accountStatus: "active",
  },
];

const DEFAULT_FACULTY_PROFILES = [
  {
    userId: "faculty01",
    employeeIdNumber: "2020001",
    firstName: "Maria",
    middleName: "L.",
    lastName: "Santos",
    gender: "Female",
    department: "IT",
    position: "Instructor",
    contactNumber: "09189876543",
    achievements: "Best Instructor 2024",
    skills: "Python, Web Development, Database Design",
    interests: "Curriculum Development, AI",
  },
  {
    userId: "faculty02",
    employeeIdNumber: "2018042",
    firstName: "Juan",
    middleName: "R.",
    lastName: "Reyes",
    gender: "Male",
    department: "CS",
    position: "Associate Professor",
    contactNumber: "09191112222",
    achievements: "Research Publication Award",
    skills: "Algorithms, Machine Learning, Data Science",
    interests: "Research, Optimization",
  },
];

const DEFAULT_STUDENT_USERS = [
  {
    userId: "student01",
    name: "Carl Lawrence Antioquia",
    email: "carl.antioquia@pnc.edu.ph",
    password: "password123",
    role: "student",
    accountStatus: "active",
  },
  {
    userId: "student02",
    name: "Lemuel John Ellasus",
    email: "lemuel.ellasus@pnc.edu.ph",
    password: "password123",
    role: "student",
    accountStatus: "active",
  },
];

const DEFAULT_STUDENT_PROFILES = [
  {
    userId: "student01",
    studentNumber: "20230001",
    firstName: "Carl Lawrence",
    middleName: "",
    lastName: "Antioquia",
    gender: "Male",
    yearLevel: "4th Year",
    program: "BSIT",
    academicStatus: "regular",
    height: 170,
    weight: 65,
    contactNumber: "09171112222",
    emergencyContactName: "Maria Antioquia",
    emergencyContactNumber: "09181112222",
    emergencyContactRelation: "Mother",
    achievements: "Dean's Lister (2023)",
    skills: "Java, Python, C++",
    interests: "Software Development",
  },
  {
    userId: "student02",
    studentNumber: "20230002",
    firstName: "Lemuel John",
    middleName: "O.",
    lastName: "Ellasus",
    gender: "Male",
    yearLevel: "4th Year",
    program: "BSIT",
    academicStatus: "regular",
    height: 168,
    weight: 62,
    contactNumber: "09172223333",
    emergencyContactName: "Susan Ellasus",
    emergencyContactNumber: "09182223333",
    emergencyContactRelation: "Mother",
    achievements: "Hackathon Finalist",
    skills: "Python, R, Machine Learning",
    interests: "Data Analytics, AI",
  },
];

const buildFacultySeed = (count = FACULTY_COUNT) => {
  const users = [];
  const profiles = [];

  for (let i = 1; i <= count; i += 1) {
    const firstName = FIRST_NAMES[(i + 3) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 5) % LAST_NAMES.length];
    const userId = `faculty${String(i).padStart(3, "0")}`;
    const employeeIdNumber = `${2020 + (i % 6)}${String(i).padStart(3, "0")}`;
    const name = `${firstName} ${lastName}`;

    users.push({
      userId,
      name,
      email: `${userId}@pnc.edu.ph`,
      password: "password123",
      role: "faculty",
      accountStatus: i % 15 === 0 ? "inactive" : "active",
    });

    profiles.push({
      userId,
      employeeIdNumber,
      firstName,
      middleName: `${String.fromCharCode(65 + (i % 26))}.`,
      lastName,
      gender: i % 2 === 0 ? "Female" : "Male",
      department: i % 3 === 0 ? "CS" : "IT",
      position: i % 5 === 0 ? "Assistant Professor" : "Instructor",
      contactNumber: `09${String(170000000 + i).padStart(9, "0")}`,
      achievements: i % 4 === 0 ? "Research Presenter" : "Curriculum Contributor",
      skills: i % 2 === 0 ? "Web Development, Databases, Software Engineering" : "Programming, Algorithms, Data Structures",
      interests: i % 2 === 0 ? "Instructional Design, Full Stack Development" : "Applied Computing, Academic Research",
    });
  }

  return { users, profiles };
};

const buildStudentSeed = (count = STUDENT_COUNT) => {
  const users = [];
  const profiles = [];

  for (let i = 1; i <= count; i += 1) {
    const firstName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 11) % LAST_NAMES.length];
    const userId = `student${String(i).padStart(4, "0")}`;
    const studentNumber = `2026${String(i).padStart(4, "0")}`;
    const name = `${firstName} ${lastName}`;
    const program = i % 3 === 0 ? "BSCS" : "BSIT";
    const yearLevel = `${((i - 1) % 4) + 1}${((i - 1) % 4) === 0 ? "st" : ((i - 1) % 4) === 1 ? "nd" : ((i - 1) % 4) === 2 ? "rd" : "th"} Year`;

    users.push({
      userId,
      name,
      email: `${userId}@pnc.edu.ph`,
      password: "password123",
      role: "student",
      accountStatus: i % 80 === 0 ? "suspended" : "active",
    });

    profiles.push({
      userId,
      studentNumber,
      firstName,
      middleName: i % 5 === 0 ? `${String.fromCharCode(65 + (i % 26))}.` : "",
      lastName,
      gender: i % 2 === 0 ? "Female" : "Male",
      yearLevel,
      program,
      academicStatus: i % 10 === 0 ? "irregular" : "regular",
      height: 150 + (i % 35),
      weight: 45 + (i % 40),
      contactNumber: `09${String(180000000 + i).padStart(9, "0")}`,
      emergencyContactName: `${FIRST_NAMES[(i + 9) % FIRST_NAMES.length]} ${lastName}`,
      emergencyContactNumber: `09${String(190000000 + i).padStart(9, "0")}`,
      emergencyContactRelation: i % 2 === 0 ? "Mother" : "Father",
      achievements: i % 7 === 0 ? "Dean's Lister" : "",
      skills: i % 2 === 0 ? "JavaScript, React, SQL" : "Python, Java, Problem Solving",
      interests: i % 3 === 0 ? "Software Engineering, Research" : "Web Development, Data Analytics",
    });
  }

  return { users, profiles };
};

const facultySeed = buildFacultySeed();
const studentSeed = buildStudentSeed();

const usersToSeed = [
  ...ADMIN_USERS,
  ...DEFAULT_FACULTY_USERS,
  ...DEFAULT_STUDENT_USERS,
  ...facultySeed.users,
  ...studentSeed.users,
];

const adminProfilesToSeed = [...ADMIN_PROFILES];
const facultyProfilesToSeed = [...DEFAULT_FACULTY_PROFILES, ...facultySeed.profiles];
const studentProfilesToSeed = [...DEFAULT_STUDENT_PROFILES, ...studentSeed.profiles];

const coursesToSeed = [
  { code: "CCS101", desc: "Introduction to Computing", units: 3, prereq: "--", year: 1, sem: 1 },
  { code: "CCS102", desc: "Computer Programming 1", units: 3, prereq: "--", year: 1, sem: 1 },
  { code: "MAT101", desc: "Mathematics in the Modern World", units: 3, prereq: "--", year: 1, sem: 1 },
  { code: "COM101", desc: "Purposive Communication", units: 3, prereq: "--", year: 1, sem: 1 },
  { code: "NSTP1", desc: "National Service Training Program 1", units: 3, prereq: "--", year: 1, sem: 1 },
  { code: "PED101", desc: "Physical Education 1", units: 2, prereq: "--", year: 1, sem: 1 },
  { code: "CCS103", desc: "Computer Programming 2", units: 3, prereq: "CCS102", year: 1, sem: 2 },
  { code: "CCS104", desc: "Discrete Structures 1", units: 3, prereq: "MAT101", year: 1, sem: 2 },
  { code: "CCS105", desc: "Human Computer Interaction 1", units: 3, prereq: "CCS101", year: 1, sem: 2 },
  { code: "CCS106", desc: "Social and Professional Issues", units: 3, prereq: "--", year: 1, sem: 2 },
  { code: "CCS201", desc: "Data Structures and Algorithms", units: 3, prereq: "CCS103", year: 2, sem: 1 },
  { code: "CCS202", desc: "Object-Oriented Programming", units: 3, prereq: "CCS103", year: 2, sem: 1 },
  { code: "CCS203", desc: "Database Management Systems", units: 3, prereq: "CCS104", year: 2, sem: 1 },
  { code: "CCS204", desc: "Operating Systems", units: 3, prereq: "CCS201", year: 2, sem: 2 },
  { code: "CCS205", desc: "Web Systems and Technologies", units: 3, prereq: "CCS202", year: 2, sem: 2 },
  { code: "CCS206", desc: "Information Management", units: 3, prereq: "CCS203", year: 2, sem: 2 },
  { code: "CCS301", desc: "Software Engineering", units: 3, prereq: "CCS205", year: 3, sem: 1 },
  { code: "CCS302", desc: "Computer Networks", units: 3, prereq: "CCS204", year: 3, sem: 1 },
  { code: "CCS303", desc: "Applications Development", units: 3, prereq: "CCS205", year: 3, sem: 1 },
  { code: "CCS304", desc: "Information Assurance and Security", units: 3, prereq: "CCS302", year: 3, sem: 2 },
  { code: "CCS305", desc: "Platform Technologies", units: 3, prereq: "CCS303", year: 3, sem: 2 },
  { code: "CCS306", desc: "System Integration and Architecture", units: 3, prereq: "CCS301", year: 3, sem: 2 },
  { code: "CCS401", desc: "Capstone Project 1", units: 3, prereq: "CCS306", year: 4, sem: 1 },
  { code: "CCS402", desc: "Capstone Project 2", units: 3, prereq: "CCS401", year: 4, sem: 2 },
  { code: "CCS403", desc: "Professional Issues in Computing", units: 3, prereq: "--", year: 4, sem: 2 },
];

const schoolYearsToSeed = [
  { schoolYear: "2025-2026", semester: "1st", isCurrent: false, startDate: "2025-08-12", endDate: "2025-12-18" },
  { schoolYear: "2025-2026", semester: "2nd", isCurrent: true, startDate: "2026-01-08", endDate: "2026-05-24" },
  { schoolYear: "2026-2027", semester: "1st", isCurrent: false, startDate: "2026-08-10", endDate: "2026-12-19" },
];

const violationTypesToSeed = [
  { violationName: "Late Attendance", description: "Student arrives after class has started.", category: "Attendance" },
  { violationName: "Absence Without Excuse", description: "Unexcused absence from scheduled class.", category: "Attendance" },
  { violationName: "Improper Uniform", description: "Uniform not compliant with policy.", category: "Uniform" },
  { violationName: "No School ID", description: "Student did not wear official school ID.", category: "Uniform" },
  { violationName: "Disruptive Conduct", description: "Behavior disrupting classroom activities.", category: "Behavior" },
  { violationName: "Academic Dishonesty", description: "Cheating, plagiarism, or unauthorized collaboration.", category: "Behavior" },
  { violationName: "Unauthorized Device Use", description: "Use of gadgets during restricted periods.", category: "Other" },
  { violationName: "Property Misuse", description: "Improper use of school facilities or equipment.", category: "Other" },
];

module.exports = {
  STUDENT_COUNT,
  FACULTY_COUNT,
  usersToSeed,
  adminProfilesToSeed,
  facultyProfilesToSeed,
  studentProfilesToSeed,
  coursesToSeed,
  schoolYearsToSeed,
  violationTypesToSeed,
};
