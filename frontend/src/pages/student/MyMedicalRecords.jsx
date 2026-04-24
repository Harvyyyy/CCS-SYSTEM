import React, { useState, useRef } from 'react';
import { 
  Activity, Calendar, Clock, User, HeartPulse, ShieldAlert,
  FileCheck, AlertCircle, UploadCloud, FileText, Download, Trash2, Edit, X, Plus,
  Droplet, Scale, Phone, Shield, ClipboardList, Stethoscope
} from 'lucide-react';
import './MyMedicalRecords.css';

const MOCK_STUDENT_ID = '2023-0001';

const MyMedicalRecords = () => {
  const [record, setRecord] = useState(() => {
    try {
      const stored = localStorage.getItem('ccs_medical_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        const myRecord = parsed.find(r => r.studentId === MOCK_STUDENT_ID);
        if (myRecord) {
          return myRecord;
        }
      }
    } catch (error) {
      console.error('Error parsing medical records:', error);
    }
    
    // Fallback if not found in LocalStorage
    return { 
      id: '1', 
      studentId: MOCK_STUDENT_ID, 
      name: 'John Doe', 
      bloodType: 'O+',
      height: '170 cm',
      weight: '65 kg',
      allergies: 'None',
      vaccinationStatus: 'Fully Vaccinated',
      emergencyContactName: 'Jane Doe',
      emergencyContactNumber: '09123456789',
      conditions: 'Asthma', 
      lastCheckup: '2023-11-15', 
      status: 'Cleared' 
    };
  });

  const [documents, setDocuments] = useState(() => {
    try {
      const storedDocs = localStorage.getItem('ccs_medical_documents');
      if (storedDocs) {
        const allDocs = JSON.parse(storedDocs);
        return allDocs.filter(d => d.studentId === MOCK_STUDENT_ID);
      }
    } catch (err) {
      console.error('Failed to parse documents', err);
    }
    return [];
  });

  const [pastRecords, setPastRecords] = useState(() => {
    try {
      const storedLogs = localStorage.getItem('ccs_medical_logs');
      if (storedLogs) {
        const allLogs = JSON.parse(storedLogs);
        const myLogs = allLogs.filter(L => L.studentId === MOCK_STUDENT_ID);
        if (myLogs.length > 0) {
          // Sort by date descending
          return myLogs.sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted));
        }
      }
    } catch (err) {
      console.error('Failed to parse logs', err);
    }
    
    // Fallback mock data
    return [
      {
        id: 'mock-log-1',
        studentId: MOCK_STUDENT_ID,
        checkupDate: '2023-11-15',
        conditions: 'Asthma',
        bloodType: 'O+',
        height: '170 cm',
        weight: '65 kg',
        allergies: 'None',
        vaccinationStatus: 'Fully Vaccinated',
        emergencyContactName: 'Jane Doe',
        emergencyContactNumber: '09123456789',
        dateCompleted: '2023-11-20',
        status: 'Cleared',
        documentAttached: 'med-cert-nov23.pdf'
      },
      {
        id: 'mock-log-2',
        studentId: MOCK_STUDENT_ID,
        checkupDate: '2022-08-10',
        conditions: 'Asthma, Mild Anemia',
        bloodType: 'O+',
        height: '168 cm',
        weight: '63 kg',
        allergies: 'None',
        vaccinationStatus: 'Partially Vaccinated',
        emergencyContactName: 'Jane Doe',
        emergencyContactNumber: '09123456789',
        dateCompleted: '2022-08-12',
        status: 'Cleared',
        documentAttached: 'clearance-aug22.pdf'
      }
    ];
  });

  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'history'
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    lastCheckup: '',
    conditions: '',
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    vaccinationStatus: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    file: null
  });

  const handleOpenModal = () => {
    setFormData({
      lastCheckup: record.lastCheckup || '',
      conditions: record.conditions || '',
      bloodType: record.bloodType || '',
      height: record.height || '',
      weight: record.weight || '',
      allergies: record.allergies || '',
      vaccinationStatus: record.vaccinationStatus || '',
      emergencyContactName: record.emergencyContactName || '',
      emergencyContactNumber: record.emergencyContactNumber || '',
      file: null
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmitRecord = (e) => {
    e.preventDefault();
    
    // 1. Update the student's main medical record
    const updatedRecord = {
      ...record,
      lastCheckup: formData.lastCheckup,
      conditions: formData.conditions,
      bloodType: formData.bloodType,
      height: formData.height,
      weight: formData.weight,
      allergies: formData.allergies,
      vaccinationStatus: formData.vaccinationStatus,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactNumber: formData.emergencyContactNumber,
      status: 'Pending Review' // Status pending when returning new records
    };
    
    setRecord(updatedRecord);

    try {
      const stored = localStorage.getItem('ccs_medical_records');
      let allRecords = stored ? JSON.parse(stored) : [];
      let foundIndex = allRecords.findIndex(r => r.studentId === MOCK_STUDENT_ID);
      
      if (foundIndex >= 0) {
        allRecords[foundIndex] = updatedRecord;
      } else {
        allRecords.push(updatedRecord);
      }
      localStorage.setItem('ccs_medical_records', JSON.stringify(allRecords));
    } catch (err) {
      console.error(err);
    }

    // 2. If there's a file attached as proof, save it
    if (formData.file) {
      const newDoc = {
        id: Date.now().toString(),
        studentId: MOCK_STUDENT_ID,
        fileName: formData.file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: (formData.file.size / 1024).toFixed(1) + ' KB'
      };

      const newDocs = [...documents, newDoc];
      setDocuments(newDocs);

      try {
        const existingDocs = localStorage.getItem('ccs_medical_documents');
        const allDocs = existingDocs ? JSON.parse(existingDocs) : [];
        allDocs.push(newDoc);
        localStorage.setItem('ccs_medical_documents', JSON.stringify(allDocs));
      } catch (err) {
        console.error(err);
      }
    }

    // 3. Save as a local medical history log
    const logDate = new Date().toISOString().split('T')[0];
    const newLog = {
      id: Date.now().toString() + '-log',
      studentId: MOCK_STUDENT_ID,
      checkupDate: formData.lastCheckup,
      conditions: formData.conditions,
      bloodType: formData.bloodType,
      height: formData.height,
      weight: formData.weight,
      allergies: formData.allergies,
      vaccinationStatus: formData.vaccinationStatus,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactNumber: formData.emergencyContactNumber,
      dateCompleted: logDate,
      status: 'Pending Review',
      documentAttached: formData.file ? formData.file.name : 'None'
    };

    const newRecordsList = [newLog, ...pastRecords];
    setPastRecords(newRecordsList);

    try {
      const storedLogs = localStorage.getItem('ccs_medical_logs');
      const allLogs = storedLogs ? JSON.parse(storedLogs) : [];
      allLogs.push(newLog);
      localStorage.setItem('ccs_medical_logs', JSON.stringify(allLogs));
    } catch (err) {
      console.error(err);
    }

    setIsModalOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newDoc = {
      id: Date.now().toString(),
      studentId: MOCK_STUDENT_ID,
      fileName: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: (file.size / 1024).toFixed(1) + ' KB'
    };

    const newDocs = [...documents, newDoc];
    setDocuments(newDocs);

    // Save to global local storage
    try {
      const existing = localStorage.getItem('ccs_medical_documents');
      const allDocs = existing ? JSON.parse(existing) : [];
      allDocs.push(newDoc);
      localStorage.setItem('ccs_medical_documents', JSON.stringify(allDocs));
    } catch (err) {
      console.error(err);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = (docId) => {
    if (!window.confirm("Are you sure you want to remove this document?")) return;

    const newDocs = documents.filter(d => d.id !== docId);
    setDocuments(newDocs);

    // Update global storage
    try {
      const existing = localStorage.getItem('ccs_medical_documents');
      if (existing) {
        const allDocs = JSON.parse(existing);
        const updatedAllDocs = allDocs.filter(d => d.id !== docId);
        localStorage.setItem('ccs_medical_documents', JSON.stringify(updatedAllDocs));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!record) return <div className="medical-loading">Loading Health Profile...</div>;

  const isCleared = record.status === 'Cleared';
  const needsUpdate = record.status === 'Needs Update';
  const isPending = record.status === 'Pending Review';

  return (
    <div className="student-medical-container">
      <div className="sm-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="sm-header-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <HeartPulse size={32} color="var(--primary-color)" />
              <h2 style={{ margin: 0 }}>My Medical Records</h2>
            </div>
            <p>View your health summary, clinic visits, and update requirements.</p>
          </div>
            <button 
              className="upload-btn" 
              onClick={handleOpenModal} 
              disabled={isCleared}
              style={{ 
                padding: '10px 20px', 
                fontSize: '15px',
                opacity: isCleared ? 0.6 : 1,
                cursor: isCleared ? 'not-allowed' : 'pointer'
              }}>
              {isPending ? <Edit size={18} /> : isCleared ? <FileCheck size={18} /> : <Plus size={18} />}
              {' '}
              {isPending ? 'Edit Pending Record' : isCleared ? 'Record Cleared (Locked)' : 'Add New Record'}
            </button>
          </div>
          
          {/* Dynamic Status Badging */}
          <div className={`sm-status-banner ${record.status.toLowerCase().replace(' ', '-')}`}>
            {isCleared && <FileCheck size={20} />}
            {needsUpdate && <AlertCircle size={20} />}
            {isPending && <Clock size={20} />}
            <div className="banner-text">
            <strong>Clearance Status: {record.status}</strong>
            <span>
              {isCleared ? 'You are cleared for all campus activities.' : 
               needsUpdate ? 'Please visit the clinic to update your medical file.' : 
               'Your medical status is currently under review.'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="sm-stats-container">
        <div className="sm-stat-card">
          <div className={`stat-icon-wrapper ${isCleared ? 'success' : needsUpdate ? 'danger' : 'warning'}`}>
            {isCleared ? <HeartPulse size={24} /> : needsUpdate ? <ShieldAlert size={24} /> : <Activity size={24} />}
          </div>
          <div className="stat-info">
            <span className="stat-label">Health Status</span>
            <span className="stat-value">{record.status}</span>
          </div>
        </div>

        <div className="sm-stat-card">
          <div className="stat-icon-wrapper">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Uploaded Docs</span>
            <span className="stat-value">{documents.length} File{documents.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="sm-stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light, rgba(79, 70, 229, 0.1))', color: 'var(--primary-color)' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Last Checkup</span>
            <span className="stat-value">{record.lastCheckup || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sm-tabs-container">
        <button 
          className={`sm-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <User size={18} /> Health Overview
        </button>
        <button 
          className={`sm-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={18} /> Past Records ({pastRecords.length})
        </button>
      </div>

      <div className="sm-content-area">
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="health-overview-container">
            {needsUpdate && (
              <div className="sm-action-prompt" style={{ marginTop: 0, marginBottom: '0px' }}>
                <ShieldAlert size={16} />
                <span>An updated physical examination is required to regain clearance.</span>
              </div>
            )}
            
            <div className="medical-table-container">
              <div className="medical-table-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HeartPulse size={20} className="section-icon" />
                  <h3>Latest Medical Record</h3>
                </div>
                <div>
                  <span className="badge-modern" style={{ 
                    color: record.status === 'Cleared' ? '#10b981' : '#f59e0b', 
                    borderColor: record.status === 'Cleared' ? '#10b981' : '#f59e0b',
                    backgroundColor: record.status === 'Cleared' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600'
                  }}>
                    {record.status === 'Cleared' ? <FileCheck size={14} /> : <Clock size={14} />}
                    {record.status}
                  </span>
                </div>
              </div>
              <div className="table-responsive-wrapper">
                <table className="medical-overview-table">
                  <tbody>
                    <tr className="table-section-row">
                      <th colSpan="2"><div className="table-th-inner"><User size={16}/> Personal Details</div></th>
                      <th colSpan="2" className="table-section-spacer"><div className="table-th-inner"><Stethoscope size={16}/> Health Statistics</div></th>
                    </tr>
                    <tr>
                      <td className="table-label">Student Name</td>
                      <td className="table-value">{record.name}</td>
                      <td className="table-label spacer-left">Vaccination Status</td>
                      <td className="table-value">
                        <span className="badge-modern badge-success-outline">
                          <Shield size={14} style={{ marginRight: '4px' }}/> {record.vaccinationStatus || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-label">Student ID</td>
                      <td className="table-value">{record.studentId}</td>
                      <td className="table-label spacer-left">Last Checkup Date</td>
                      <td className="table-value">
                        <Calendar size={16} className="text-muted" style={{ marginRight: '6px', verticalAlign: '-3px' }}/>
                        {record.lastCheckup || 'Unknown'}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-label">Height & Weight</td>
                      <td className="table-value">
                        <Scale size={16} color="var(--primary-color)" style={{ marginRight: '6px', verticalAlign: '-3px' }}/>
                        {record.height || 'N/A'} • {record.weight || 'N/A'}
                      </td>
                      <td className="table-label spacer-left">Pre-existing Conditions</td>
                      <td className="table-value">
                        <div className="info-box-styled caution" style={{ margin: 0 }}>
                          <Activity size={16} />
                          <span>{record.conditions || 'None reported'}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-label">Blood Type</td>
                      <td className="table-value">
                        <span className="blood-type-badge-large">
                          <Droplet size={14} style={{ marginRight: '4px' }} /> {record.bloodType || 'Not Provided'}
                        </span>
                      </td>
                      <td className="table-label spacer-left">Allergies</td>
                      <td className="table-value">
                        <div className="info-box-styled warning" style={{ margin: 0 }}>
                          <AlertCircle size={16} />
                          <span>{record.allergies || 'None reported'}</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="table-section-row">
                      <th colSpan="4"><div className="table-th-inner"><Phone size={16}/> Emergency Contact</div></th>
                    </tr>
                    <tr>
                      <td className="table-label">Primary Contact</td>
                      <td className="table-value">{record.emergencyContactName || 'Not Set'}</td>
                      <td className="table-label spacer-left">Contact Number</td>
                      <td className="table-value">
                        {record.emergencyContactNumber ? (
                          <a href={`tel:${record.emergencyContactNumber}`} className="contact-link">
                            {record.emergencyContactNumber}
                          </a>
                        ) : 'Not Set'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="profile-section documents-section" style={{ marginTop: '0px' }}>
              <div className="section-header">
                <FileText size={18} className="section-icon" />
                <h4 style={{ flex: 1 }}>Uploaded Medical Documents</h4>
                  <button 
                    className="upload-btn-small" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCleared}
                    style={{ 
                      opacity: isCleared ? 0.6 : 1,
                      cursor: isCleared ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <UploadCloud size={14} /> Upload
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={isCleared}
                  />
                </div>
              
              <div className="documents-list">
                {documents.length === 0 ? (
                  <div className="no-docs">
                    <FileText size={24} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>No documents uploaded yet.</p>
                  </div>
                ) : (
                  documents.map(doc => (
                    <div key={doc.id} className="doc-item">
                      <div className="doc-info">
                        <FileText size={18} className="doc-icon" />
                        <div className="doc-details">
                          <span className="doc-name">{doc.fileName}</span>
                          <span className="doc-meta">{doc.uploadDate} • {doc.fileSize}</span>
                        </div>
                      </div>
                      <div className="doc-actions">
                          {!isCleared && (
                            <button className="doc-action-btn delete" onClick={() => handleDeleteDocument(doc.id)} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right Column / Bottom: Past Records */}
        {activeTab === 'history' && (
          <div className="sm-history-card">
            <div className="card-header">
              <Clock className="card-icon" />
              <h3>Past Records & Updates</h3>
            </div>
            <div className="record-cards-grid">
              {pastRecords.length === 0 ? (
                <div className="no-docs" style={{ marginTop: '0' }}>
                  <Clock size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>No past records found.</p>
                </div>
              ) : (
                pastRecords.map((log) => (
                  <div key={log.id} className="record-card">
                    <div className="record-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="record-card-icon">
                          <Activity size={18} />
                        </div>
                        <div>
                          <h5>Medical Record Filed</h5>
                          <span className="record-date">{log.dateCompleted}</span>
                        </div>
                      </div>
                      <span className={`visit-status ${log.status === 'Cleared' ? 'cleared' : 'pending'}`}>
                        {log.status || 'Pending'}
                      </span>
                    </div>
                    <div className="record-card-body">
                      <div className="record-card-grid">
                        <div className="record-detail-item">
                          <span className="detail-label">Checkup Date</span>
                          <span className="detail-value">{log.checkupDate}</span>
                        </div>
                        <div className="record-detail-item">
                          <span className="detail-label">Blood Type</span>
                          <span className="detail-value blood-type-badge-small">{log.bloodType || 'N/A'}</span>
                        </div>
                        <div className="record-detail-item">
                          <span className="detail-label">Height & Weight</span>
                          <span className="detail-value">{log.height || 'N/A'} • {log.weight || 'N/A'}</span>
                        </div>
                        <div className="record-detail-item">
                          <span className="detail-label">Vaccination</span>
                          <span className="detail-value">{log.vaccinationStatus || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div className="record-full-width-details">
                        <div className="record-detail-item">
                          <span className="detail-label">Conditions</span>
                          <span className="detail-value">{log.conditions || 'None'}</span>
                        </div>
                        <div className="record-detail-item">
                          <span className="detail-label">Allergies</span>
                          <span className="detail-value">{log.allergies || 'None'}</span>
                        </div>
                        <div className="record-detail-item">
                          <span className="detail-label">Emergency Contact</span>
                          <span className="detail-value">{log.emergencyContactName || 'None'} ({log.emergencyContactNumber || 'N/A'})</span>
                        </div>
                      </div>

                      {log.documentAttached && log.documentAttached !== 'None' && (
                        <div className="record-docs">
                          <FileText size={14} />
                          <span>{log.documentAttached} attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Log New Medical Record Modal */}
      {isModalOpen && (
        <div className="medical-modal-overlay">
          <div className="medical-modal-box">
            <div className="medical-modal-header">
              <h3>Add New Medical Record</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form className="medical-form" onSubmit={handleSubmitRecord}>
              <div className="medical-form-grid">
                <div className="medical-form-group">
                  <label>Date of Checkup / Update</label>
                  <input 
                    type="date" 
                    name="lastCheckup" 
                    value={formData.lastCheckup} 
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="medical-form-group">
                  <label>Blood Type</label>
                  <select name="bloodType" value={formData.bloodType} onChange={handleFormChange}>
                    <option value="">Select Blood Type...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="medical-form-group">
                  <label>Height</label>
                  <input 
                    type="text" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleFormChange}
                    placeholder="e.g. 170 cm"
                  />
                </div>

                <div className="medical-form-group">
                  <label>Weight</label>
                  <input 
                    type="text" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleFormChange}
                    placeholder="e.g. 65 kg"
                  />
                </div>

                <div className="medical-form-group">
                  <label>Vaccination Status</label>
                  <select name="vaccinationStatus" value={formData.vaccinationStatus} onChange={handleFormChange}>
                    <option value="">Select Status...</option>
                    <option value="Fully Vaccinated">Fully Vaccinated</option>
                    <option value="Partially Vaccinated">Partially Vaccinated</option>
                    <option value="Unvaccinated">Unvaccinated</option>
                  </select>
                </div>

                <div className="medical-form-group">
                  <label>Emergency Contact Name</label>
                  <input 
                    type="text" 
                    name="emergencyContactName" 
                    value={formData.emergencyContactName} 
                    onChange={handleFormChange}
                    placeholder="Name of contact person"
                  />
                </div>

                <div className="medical-form-group">
                  <label>Emergency Contact Number</label>
                  <input 
                    type="tel" 
                    name="emergencyContactNumber" 
                    value={formData.emergencyContactNumber} 
                    onChange={handleFormChange}
                    placeholder="Contact number"
                  />
                </div>

                <div className="medical-form-group full-width">
                  <label>Allergies</label>
                  <input 
                    type="text"
                    name="allergies" 
                    value={formData.allergies} 
                    onChange={handleFormChange}
                    placeholder="e.g. Peanuts, Penicillin, or 'None'"
                  />
                </div>

                <div className="medical-form-group full-width">
                  <label>Pre-existing Conditions / Notes</label>
                  <textarea 
                    name="conditions" 
                    value={formData.conditions} 
                    onChange={handleFormChange}
                    placeholder="e.g. Asthma, or 'None'"
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div className="medical-form-group full-width">
                  <label>Supporting Document (Proof)</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="styled-file-input"
                  />
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Please attach a clear photo or PDF of your medical certificate or checkup result.
                </small>
              </div>
              </div>

              <div className="medical-form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMedicalRecords;