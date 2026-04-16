import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, Eye, AlertTriangle, FileText, CheckCircle, Clock, Tag } from 'lucide-react';
import './ViolationManagement.css';

const DEFAULT_TYPE_FORM = {
  violationName: '',
  description: '',
  category: 'Behavior'
};

const DEFAULT_VIOLATION_FORM = {
  student: '',
  violationType: '',
  offenseLevel: '1st',
  violationDate: '',
  violationTime: '',
  description: '',
  concernedPersonnel: '',
  disciplinaryAction: '',
  remarks: ''
};

const OFFENSE_LEVELS = ['1st', '2nd', '3rd', '4th'];
const VIOLATION_CATEGORIES = ['Attendance', 'Uniform', 'Behavior', 'Other'];

const formatDate = (dateValue) => {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString();
};

const ViolationManagement = () => {
  const [students, setStudents] = useState([]);
  const [violationTypes, setViolationTypes] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterOffenseLevel, setFilterOffenseLevel] = useState('All');

  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingViolation, setEditingViolation] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [violationForm, setViolationForm] = useState(DEFAULT_VIOLATION_FORM);
  const [typeForm, setTypeForm] = useState(DEFAULT_TYPE_FORM);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const [studentsResponse, typesResponse, violationsResponse] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/violation-types'),
        axios.get('/api/violations')
      ]);

      setStudents(studentsResponse.data || []);
      setViolationTypes(typesResponse.data || []);
      setViolations(violationsResponse.data || []);
    } catch (error) {
      console.error('Failed to load violation management data:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to load violation data from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const studentOptions = useMemo(() => {
    return students.map((student) => ({
      id: student._id || student.id,
      label: `${student.studentNumber || '-'} - ${student.lastName || ''}, ${student.firstName || ''}${student.middleName ? ` ${student.middleName}` : ''}`.trim()
    }));
  }, [students]);

  const normalizedViolations = useMemo(() => {
    return violations.map((violation) => {
      const student = violation.student || {};
      const violationType = violation.violationType || {};
      return {
        id: violation._id || violation.id,
        studentId: student._id || student.id || '',
        studentNumber: student.studentNumber || '',
        studentName: `${student.lastName || ''}, ${student.firstName || ''}${student.middleName ? ` ${student.middleName}` : ''}`.replace(/^,\s*/, '').trim(),
        violationTypeId: violationType._id || violationType.id || '',
        violationTypeName: violationType.violationName || '',
        violationCategory: violationType.category || 'Other',
        offenseLevel: violation.offenseLevel || '1st',
        violationDate: violation.violationDate || '',
        violationTime: violation.violationTime || '',
        description: violation.description || '',
        concernedPersonnel: violation.concernedPersonnel || '',
        disciplinaryAction: violation.disciplinaryAction || '',
        remarks: violation.remarks || '',
        reportedBy: violation.reportedBy || null,
        createdAt: violation.createdAt || ''
      };
    });
  }, [violations]);

  const filteredViolations = useMemo(() => {
    return normalizedViolations.filter((violation) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        violation.studentName.toLowerCase().includes(search) ||
        violation.studentNumber.toLowerCase().includes(search) ||
        violation.violationTypeName.toLowerCase().includes(search) ||
        violation.description.toLowerCase().includes(search);
      const matchesCategory = filterCategory === 'All' || violation.violationCategory === filterCategory;
      const matchesOffenseLevel = filterOffenseLevel === 'All' || violation.offenseLevel === filterOffenseLevel;
      return matchesSearch && matchesCategory && matchesOffenseLevel;
    });
  }, [normalizedViolations, searchTerm, filterCategory, filterOffenseLevel]);

  const handleViolationInputChange = (event) => {
    const { name, value } = event.target;
    setViolationForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleTypeInputChange = (event) => {
    const { name, value } = event.target;
    setTypeForm((previous) => ({ ...previous, [name]: value }));
  };

  const openViolationModal = (violation = null) => {
    if (violation) {
      setEditingViolation(violation);
      setViolationForm({
        student: violation.studentId,
        violationType: violation.violationTypeId,
        offenseLevel: violation.offenseLevel,
        violationDate: violation.violationDate ? String(violation.violationDate).slice(0, 10) : '',
        violationTime: violation.violationTime || '',
        description: violation.description || '',
        concernedPersonnel: violation.concernedPersonnel || '',
        disciplinaryAction: violation.disciplinaryAction || '',
        remarks: violation.remarks || ''
      });
    } else {
      setEditingViolation(null);
      setViolationForm(DEFAULT_VIOLATION_FORM);
    }
    setIsViolationModalOpen(true);
  };

  const closeViolationModal = () => {
    setIsViolationModalOpen(false);
    setEditingViolation(null);
  };

  const openTypeModal = (typeRecord = null) => {
    if (typeRecord) {
      setEditingType(typeRecord);
      setTypeForm({
        violationName: typeRecord.violationName || '',
        description: typeRecord.description || '',
        category: typeRecord.category || 'Behavior'
      });
    } else {
      setEditingType(null);
      setTypeForm(DEFAULT_TYPE_FORM);
    }
    setIsTypeModalOpen(true);
  };

  const closeTypeModal = () => {
    setIsTypeModalOpen(false);
    setEditingType(null);
  };

  const openViewModal = (violation) => {
    setSelectedViolation(violation);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedViolation(null);
    setIsViewModalOpen(false);
  };

  const renderStatusIcon = (level) => {
    switch (level) {
      case '1st': return <Clock size={14} />;
      case '2nd': return <FileText size={14} />;
      case '3rd': return <AlertTriangle size={14} />;
      case '4th': return <CheckCircle size={14} />;
      default: return null;
    }
  };

  const handleViolationSave = (event) => {
    event.preventDefault();

    const payload = {
      student: violationForm.student,
      violationType: violationForm.violationType,
      offenseLevel: violationForm.offenseLevel,
      violationDate: violationForm.violationDate,
      violationTime: violationForm.violationTime,
      description: violationForm.description,
      concernedPersonnel: violationForm.concernedPersonnel,
      disciplinaryAction: violationForm.disciplinaryAction,
      remarks: violationForm.remarks
    };

    const request = editingViolation
      ? axios.put(`/api/violations/${editingViolation.id}`, payload)
      : axios.post('/api/violations', payload);

    request.then(() => {
      closeViolationModal();
      loadData();
    }).catch((error) => {
      console.error('Failed to save violation record:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to save violation record.');
    });
  };

  const handleTypeSave = (event) => {
    event.preventDefault();

    const payload = {
      violationName: typeForm.violationName,
      description: typeForm.description,
      category: typeForm.category
    };

    const request = editingType
      ? axios.put(`/api/violation-types/${editingType.id}`, payload)
      : axios.post('/api/violation-types', payload);

    request.then(() => {
      closeTypeModal();
      loadData();
    }).catch((error) => {
      console.error('Failed to save violation type:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to save violation type.');
    });
  };

  const handleViolationDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this violation record?')) return;

    axios.delete(`/api/violations/${id}`).then(() => {
      setViolations((previous) => previous.filter((violation) => (violation._id || violation.id) !== id));
    }).catch((error) => {
      console.error('Failed to delete violation record:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to delete violation record.');
    });
  };

  const handleTypeDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this violation type?')) return;

    axios.delete(`/api/violation-types/${id}`).then(() => {
      setViolationTypes((previous) => previous.filter((typeRecord) => (typeRecord._id || typeRecord.id) !== id));
    }).catch((error) => {
      console.error('Failed to delete violation type:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to delete violation type.');
    });
  };

  return (
    <div className="violation-management-container">
      {errorMessage && <div className="violation-error-banner">{errorMessage}</div>}

      <div className="violation-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={32} color="var(--primary-color)" />
            <h1 style={{ margin: 0 }}>Violation Management</h1>
          </div>
          <p>Manage violation types and student violation records from the backend.</p>
        </div>
        <div className="violation-header-actions">
          <button className="btn-secondary" onClick={() => openTypeModal()}>
            <Tag size={18} /> Add Violation Type
          </button>
          <button className="btn-add" onClick={() => openViolationModal()}>
            <Plus size={18} /> Add Violation
          </button>
        </div>
      </div>

      <div className="violation-summary-grid">
        <div className="violation-summary-card">
          <span className="summary-label">Violation Types</span>
          <strong>{violationTypes.length}</strong>
        </div>
        <div className="violation-summary-card">
          <span className="summary-label">Records</span>
          <strong>{normalizedViolations.length}</strong>
        </div>
        <div className="violation-summary-card">
          <span className="summary-label">Students Loaded</span>
          <strong>{students.length}</strong>
        </div>
      </div>

      <section className="violation-section">
        <div className="section-header">
          <div>
            <h2>Violation Types</h2>
            <p>These are the labels used when creating violation records.</p>
          </div>
        </div>

        <div className="table-container type-table-container">
          <table className="violation-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {violationTypes.length > 0 ? (
                violationTypes.map((typeRecord) => (
                  <tr key={typeRecord._id || typeRecord.id}>
                    <td className="fw-medium">{typeRecord.violationName}</td>
                    <td>{typeRecord.category}</td>
                    <td>{typeRecord.description || '-'}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon edit" onClick={() => openTypeModal(typeRecord)} title="Edit Type">
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleTypeDelete(typeRecord._id || typeRecord.id)} title="Delete Type">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state">No violation types found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="violation-section">
        <div className="section-header">
          <div>
            <h2>Student Violations</h2>
            <p>Search and manage individual violation records.</p>
          </div>
        </div>

        <div className="violation-controls">
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by student, number, violation type, or description..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-group">
            <select className="filter-select" value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
              <option value="All">All Categories</option>
              {VIOLATION_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select className="filter-select" value={filterOffenseLevel} onChange={(event) => setFilterOffenseLevel(event.target.value)}>
              <option value="All">All Offense Levels</option>
              {OFFENSE_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="violation-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Violation Type</th>
                <th>Offense</th>
                <th>Date</th>
                <th>Concerned Personnel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-state">Loading violation data...</td>
                </tr>
              ) : filteredViolations.length > 0 ? (
                filteredViolations.map((violation) => (
                  <tr key={violation.id}>
                    <td>
                      <div className="offender-info">
                        <span className="offender-name">{violation.studentName || 'Unknown Student'}</span>
                        <span className="offender-id">{violation.studentNumber || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="type-stack">
                        <span className="fw-medium">{violation.violationTypeName || '-'}</span>
                        <span className="type-subtext">{violation.violationCategory}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-offense-level">
                        {renderStatusIcon(violation.offenseLevel)} {violation.offenseLevel}
                      </span>
                    </td>
                    <td>{formatDate(violation.violationDate)}</td>
                    <td>{violation.concernedPersonnel || '-'}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon view" onClick={() => openViewModal(violation)} title="View Details">
                          <Eye size={18} />
                        </button>
                        <button className="btn-icon edit" onClick={() => openViolationModal(violation)} title="Edit Record">
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleViolationDelete(violation.id)} title="Delete Record">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">No violation records found matching the filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isTypeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingType ? 'Edit Violation Type' : 'Add Violation Type'}</h2>
              <button className="btn-close" onClick={closeTypeModal}>&times;</button>
            </div>
            <form onSubmit={handleTypeSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Violation Name</label>
                  <input className="form-control" type="text" name="violationName" value={typeForm.violationName} onChange={handleTypeInputChange} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" name="category" value={typeForm.category} onChange={handleTypeInputChange} required>
                    {VIOLATION_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" name="description" value={typeForm.description} onChange={handleTypeInputChange} rows="3" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeTypeModal}>Cancel</button>
                <button type="submit" className="btn-save">Save Type</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViolationModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-wide">
            <div className="modal-header">
              <h2>{editingViolation ? 'Edit Violation Record' : 'Add Violation Record'}</h2>
              <button className="btn-close" onClick={closeViolationModal}>&times;</button>
            </div>
            <form onSubmit={handleViolationSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Student</label>
                    <select className="form-control" name="student" value={violationForm.student} onChange={handleViolationInputChange} required>
                      <option value="">Select student</option>
                      {studentOptions.map((student) => (
                        <option key={student.id} value={student.id}>{student.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Violation Type</label>
                    <select className="form-control" name="violationType" value={violationForm.violationType} onChange={handleViolationInputChange} required>
                      <option value="">Select violation type</option>
                      {violationTypes.map((typeRecord) => (
                        <option key={typeRecord._id || typeRecord.id} value={typeRecord._id || typeRecord.id}>{typeRecord.violationName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Offense Level</label>
                    <select className="form-control" name="offenseLevel" value={violationForm.offenseLevel} onChange={handleViolationInputChange} required>
                      {OFFENSE_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date of Violation</label>
                    <input className="form-control" type="date" name="violationDate" value={violationForm.violationDate} onChange={handleViolationInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Time of Violation</label>
                    <input className="form-control" type="time" name="violationTime" value={violationForm.violationTime} onChange={handleViolationInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Concerned Personnel</label>
                    <input className="form-control" type="text" name="concernedPersonnel" value={violationForm.concernedPersonnel} onChange={handleViolationInputChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" name="description" value={violationForm.description} onChange={handleViolationInputChange} rows="3" required />
                </div>

                <div className="form-group">
                  <label>Disciplinary Action</label>
                  <input className="form-control" type="text" name="disciplinaryAction" value={violationForm.disciplinaryAction} onChange={handleViolationInputChange} />
                </div>

                <div className="form-group">
                  <label>Remarks</label>
                  <textarea className="form-control" name="remarks" value={violationForm.remarks} onChange={handleViolationInputChange} rows="2" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeViolationModal}>Cancel</button>
                <button type="submit" className="btn-save">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedViolation && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-wide">
            <div className="modal-header">
              <h2>Violation Details</h2>
              <button className="btn-close" onClick={closeViewModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-row">
                  <div className="detail-label">Student</div>
                  <div className="detail-value">
                    <strong>{selectedViolation.studentName || 'Unknown Student'}</strong>
                    <div>{selectedViolation.studentNumber || '-'}</div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Violation Type</div>
                  <div className="detail-value">{selectedViolation.violationTypeName || '-'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Category</div>
                  <div className="detail-value">{selectedViolation.violationCategory}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Offense Level</div>
                  <div className="detail-value">
                    <span className="badge badge-offense-level">
                      {renderStatusIcon(selectedViolation.offenseLevel)} {selectedViolation.offenseLevel}
                    </span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Violation Date</div>
                  <div className="detail-value">{formatDate(selectedViolation.violationDate)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Violation Time</div>
                  <div className="detail-value">{selectedViolation.violationTime || '-'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Concerned Personnel</div>
                  <div className="detail-value">{selectedViolation.concernedPersonnel || '-'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Disciplinary Action</div>
                  <div className="detail-value">{selectedViolation.disciplinaryAction || '-'}</div>
                </div>
                <div className="detail-row detail-row-full">
                  <div className="detail-label">Description</div>
                  <div className="detail-value">{selectedViolation.description || '-'}</div>
                </div>
                <div className="detail-row detail-row-full" style={{ borderBottom: 'none' }}>
                  <div className="detail-label">Remarks</div>
                  <div className="detail-value">{selectedViolation.remarks || '-'}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationManagement;