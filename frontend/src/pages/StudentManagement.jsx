import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, X, Filter, Users } from 'lucide-react';
import './StudentManagement.css';

const DEFAULT_FORM_DATA = {
  studentNo: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: 'Male',
  yearLevel: '1st Year',
  program: 'BSCS',
  academicTrack: '',
  section: '',
  academicStatus: 'Regular',
  height: '',
  weight: '',
  email: '',
  contactNumber: '',
  emergencyName: '',
  emergencyNumber: '',
  emergencyRelation: '',
  yearGraduated: '',
  profileImage: ''
};

const INITIAL_STUDENTS = [
  {
    id: '1',
    studentNo: '2024-0001',
    firstName: 'Alyssa',
    middleName: 'Mae',
    lastName: 'Ramos',
    gender: 'Female',
    yearLevel: '1st Year',
    program: 'BSCS',
    academicTrack: 'Core Curriculum',
    section: 'CS1A',
    academicStatus: 'Regular',
    height: '162',
    weight: '54',
    email: 'alyssa.ramos@pnc.edu.ph',
    contactNumber: '09171234567',
    emergencyName: 'Rina Ramos',
    emergencyNumber: '09181234567',
    emergencyRelation: 'Mother',
    yearGraduated: '',
    profileImage: ''
  },
  {
    id: '2',
    studentNo: '2023-0158',
    firstName: 'Mark',
    middleName: 'Lopez',
    lastName: 'Dela Cruz',
    gender: 'Male',
    yearLevel: '2nd Year',
    program: 'BSIT',
    academicTrack: 'Networking',
    section: 'IT2B',
    academicStatus: 'Regular',
    height: '170',
    weight: '68',
    email: 'mark.delacruz@pnc.edu.ph',
    contactNumber: '09172345678',
    emergencyName: 'Mario Dela Cruz',
    emergencyNumber: '09182345678',
    emergencyRelation: 'Father',
    yearGraduated: '',
    profileImage: ''
  },
  {
    id: '3',
    studentNo: '2022-0420',
    firstName: 'Janelle',
    middleName: 'T.',
    lastName: 'Santos',
    gender: 'Female',
    yearLevel: '3rd Year',
    program: 'BSCS',
    academicTrack: '',
    section: 'CS3A',
    academicStatus: 'Irregular',
    height: '158',
    weight: '',
    email: 'janelle.santos@pnc.edu.ph',
    contactNumber: '09173456789',
    emergencyName: 'Nestor Santos',
    emergencyNumber: '09183456789',
    emergencyRelation: 'Guardian',
    yearGraduated: '',
    profileImage: ''
  },
  {
    id: '4',
    studentNo: '2021-0092',
    firstName: 'Rafael',
    middleName: 'P.',
    lastName: 'Navarro',
    gender: 'Male',
    yearLevel: '4th Year',
    program: 'BSIT',
    academicTrack: 'Software Engineering',
    section: 'IT4A',
    academicStatus: 'Regular',
    height: '175',
    weight: '72',
    email: 'rafael.navarro@pnc.edu.ph',
    contactNumber: '09174567890',
    emergencyName: 'Rosa Navarro',
    emergencyNumber: '09184567890',
    emergencyRelation: 'Mother',
    yearGraduated: '',
    profileImage: ''
  }
];

const normalizeStudent = (student) => {
  if (student.firstName) {
    return {
      ...DEFAULT_FORM_DATA,
      ...student
    };
  }

  const fullName = student.fullName || '';
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

  return {
    ...DEFAULT_FORM_DATA,
    id: student.id || Date.now().toString(),
    studentNo: student.studentNo || '',
    firstName,
    middleName,
    lastName,
    yearLevel: student.yearLevel || '1st Year',
    program: student.course || 'BSCS',
    section: student.section || '',
    academicStatus: student.status === 'Inactive' ? 'Irregular' : 'Regular',
    email: student.email || ''
  };
};

const StudentManagement = () => {
  const [students, setStudents] = useState(() => {
    try {
      const stored = localStorage.getItem('ccs_students');
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = parsed.map(normalizeStudent);
        localStorage.setItem('ccs_students', JSON.stringify(normalized));
        return normalized;
      }
      localStorage.setItem('ccs_students', JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    } catch {
      localStorage.setItem('ccs_students', JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const saveToStorage = (updatedStudents) => {
    setStudents(updatedStudents);
    localStorage.setItem('ccs_students', JSON.stringify(updatedStudents));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      setFormData(DEFAULT_FORM_DATA);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      const updated = students.map((student) =>
        student.id === editingStudent.id ? { ...formData, id: student.id } : student
      );
      saveToStorage(updated);
    } else {
      const newStudent = { ...formData, id: Date.now().toString() };
      saveToStorage([...students, newStudent]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updated = students.filter((student) => student.id !== id);
      saveToStorage(updated);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.middleName} ${student.lastName}`.trim();
      const matchesSearch =
        (student.studentNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.section || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.program || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || student.academicStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  return (
    <div className="student-management-container">
      <div className="page-header">
        <div>
          <h2>Student Management</h2>
          <p>Manage student profiles, section assignments, and enrollment status.</p>
        </div>
        <button className="add-btn" onClick={() => openModal()}>
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="sm-controls-bar">
        <div className="sm-search-box">
          <Search size={18} className="sm-search-icon" />
          <input
            type="text"
            placeholder="Search by student no., name, section, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sm-filter-box">
          <Filter size={18} className="sm-filter-icon" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Academic Status</option>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
          </select>
        </div>
      </div>

      <div className="sm-table-container">
        <table className="sm-students-table">
          <thead>
            <tr>
              <th>Student No.</th>
              <th>Name</th>
              <th>Program</th>
              <th>Year / Section</th>
              <th>Academic Status</th>
              <th>Contact</th>
              <th>Emergency Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="sm-table-cell-content">
                      <div className="fw-medium">{student.studentNo}</div>
                    </div>
                  </td>
                  <td>
                    <div className="sm-table-cell-content">
                      <div>{`${student.lastName}, ${student.firstName}${student.middleName ? ` ${student.middleName}` : ''}`}</div>
                    </div>
                  </td>
                  <td>
                    <div className="sm-table-cell-content">
                      <div>{student.program}</div>
                    </div>
                  </td>
                  <td>
                    <div className="sm-table-cell-content">
                      <div>{`${student.yearLevel} • ${student.section || 'N/A'}`}</div>
                    </div>
                  </td>
                  <td>
                    <div className="sm-table-cell-content">
                      <div>
                        <span className={`sm-status-badge ${student.academicStatus.toLowerCase()}`}>
                          {student.academicStatus}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="sm-table-cell-content">
                      <div>{student.contactNumber || '-'}</div>
                      <div className="sm-cell-subtext">{student.email || '-'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="sm-table-cell-content">
                      <div>{student.emergencyName || '-'}</div>
                      <div className="sm-cell-subtext">{student.emergencyNumber || '-'}</div>
                    </div>
                  </td>
                  <td className="sm-actions-cell">
                    <div className="sm-actions-group">
                      <button className="sm-action-btn edit" onClick={() => openModal(student)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="sm-action-btn delete" onClick={() => handleDelete(student.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="sm-empty-state">
                  <Users size={20} /> No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <h4 className="form-section-title">Basic Information</h4>
              <div className="form-row">
                <div className="form-group half">
                  <label>Student Number</label>
                  <input
                    type="text"
                    name="studentNo"
                    value={formData.studentNo}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 2026-0001"
                  />
                </div>
                <div className="form-group half">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group half">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter last name"
                />
              </div>

              <h4 className="form-section-title">Academic Information</h4>
              <div className="form-row">
                <div className="form-group half">
                  <label>Program</label>
                  <select name="program" value={formData.program} onChange={handleInputChange}>
                    <option value="BSCS">BSCS</option>
                    <option value="BSIT">BSIT</option>
                  </select>
                </div>
                <div className="form-group half">
                  <label>Year Level</label>
                  <select name="yearLevel" value={formData.yearLevel} onChange={handleInputChange}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Section</label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g. CS2A"
                  />
                </div>
                <div className="form-group half">
                  <label>Academic Track</label>
                  <input
                    type="text"
                    name="academicTrack"
                    value={formData.academicTrack}
                    onChange={handleInputChange}
                    placeholder="Optional track"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Academic Status</label>
                  <select name="academicStatus" value={formData.academicStatus} onChange={handleInputChange}>
                    <option value="Regular">Regular</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>
                <div className="form-group half">
                  <label>Year Graduated</label>
                  <input
                    type="number"
                    name="yearGraduated"
                    value={formData.yearGraduated}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <h4 className="form-section-title">Physical Information</h4>
              <div className="form-row">
                <div className="form-group half">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group half">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    min="1"
                  />
                </div>
              </div>

              <h4 className="form-section-title">Contact Information</h4>
              <div className="form-row">
                <div className="form-group half">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@pnc.edu.ph"
                  />
                </div>
                <div className="form-group half">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="09XXXXXXXXX"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>Emergency Contact Number</label>
                  <input
                    type="text"
                    name="emergencyNumber"
                    value={formData.emergencyNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Emergency Contact Relation</label>
                  <input
                    type="text"
                    name="emergencyRelation"
                    value={formData.emergencyRelation}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Mother"
                  />
                </div>
                <div className="form-group half">
                  <label>Profile Image Path</label>
                  <input
                    type="text"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
