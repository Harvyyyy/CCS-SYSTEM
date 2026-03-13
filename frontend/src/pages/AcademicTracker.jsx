import React, { useState, useEffect } from 'react';
import './AcademicTracker.css';

const MOCK_GRADES = {
  'CCS101': { grade: '1.50', status: 'PASSED' },
  'CCS102': { grade: '2.50', status: 'PASSED' },
  'ETH101': { grade: '1.75', status: 'PASSED' },
  'MAT101': { grade: '2.00', status: 'PASSED' },
  'NSTP1': { grade: 'PASSED', status: 'PASSED' },
  'PED101': { grade: '1.25', status: 'PASSED' },
  'PSY100': { grade: '1.25', status: 'PASSED' },
  
  'CCS103': { grade: '1.25', status: 'PASSED' },
  'CCS104': { grade: '2.00', status: 'PASSED' },
  'CCS105': { grade: '1.25', status: 'PASSED' },
  'CCS106': { grade: '1.75', status: 'PASSED' },
  'COM101': { grade: '1.50', status: 'PASSED' },
  'GAD101': { grade: '1.25', status: 'PASSED' },
  'NSTP2': { grade: 'PASSED', status: 'PASSED' },
  'PED102': { grade: '1.00', status: 'PASSED' },
};

const AcademicTracker = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Load courses from LocalStorage (managed by Admin)
    const storedCourses = localStorage.getItem('ccs_courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    }
  }, []);

  // Compute Year & Semester Groupings
  const getCoursesForTerm = (year, sem) => {
    return courses.filter(c => c.year === year && c.sem === sem).sort((a,b) => a.code.localeCompare(b.code));
  };

  const renderCourseTable = (year, sem) => {
    const termCourses = getCoursesForTerm(year, sem);
    if (termCourses.length === 0) return null;

    const totalUnits = termCourses.reduce((sum, course) => sum + (Number(course.units) || 0), 0);
    const suffix = year === 1 ? 'st Year' : year === 2 ? 'nd Year' : year === 3 ? 'rd Year' : 'th Year';
    const semName = sem === 1 ? '1st Semester' : sem === 2 ? '2nd Semester' : 'Summer';

    return (
      <div className="at-card" key={`y${year}-s${sem}`}>
        <div className="at-card-header">
          <span className="at-year-label">{year}{suffix}</span>
          <span className="at-sem-label">{semName}</span>
        </div>
        <table className="at-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Description</th>
              <th>Units</th>
              <th>Prerequisites</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {termCourses.map(course => {
              const gradeInfo = MOCK_GRADES[course.code] || { grade: '-', status: '-' };
              
              return (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.desc}</td>
                  <td>{course.units}</td>
                  <td>{course.prereq}</td>
                  <td>{gradeInfo.grade}</td>
                  <td>
                    <span className={`at-status-badge ${gradeInfo.status === 'PASSED' ? 'passed' : ''}`}>
                      {gradeInfo.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="text-right fw-bold">Total No. of Units</td>
              <td className="fw-bold">{totalUnits}</td>
              <td colSpan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <div className="academic-tracker-container">
      <h2 className="page-title">Academic Progress Tracker</h2>

      {/* Retention History Section */}
      <div className="at-card mb-40">
        <div className="at-card-header">
          <span>Retention History</span>
          <button className="btn-guidelines">View Guidelines</button>
        </div>
        <table className="at-table retention-table">
          <thead>
            <tr>
              <th>Semester</th>
              <th>Warnings</th>
              <th>Status</th>
              <th>Requirement</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Hardcoded history based on mock image */}
            {[
              "1st Semester A.Y. 2022-2023",
              "2nd Semester A.Y. 2022-2023",
              "1st Semester A.Y. 2023-2024",
              "2nd Semester A.Y. 2023-2024",
              "1st Semester A.Y. 2024-2025",
              "2nd Semester A.Y. 2024-2025",
              "1st Semester A.Y. 2025-2026",
            ].map((semStr, idx) => (
              <tr key={idx}>
                <td>{semStr}</td>
                <td>None</td>
                <td>With Good Standing</td>
                <td>None</td>
                <td><button className="btn-none">None</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.length === 0 ? (
        <div className="empty-message">No courses have been configured yet. Please check back later.</div>
      ) : (
        <>
          {renderCourseTable(1, 1)}
          {renderCourseTable(1, 2)}
        </>
      )}

    </div>
  );
};

export default AcademicTracker;