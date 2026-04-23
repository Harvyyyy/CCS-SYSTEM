import React, { useEffect, useMemo, useState } from 'react';
import { CalendarRange, Layers, Plus, Edit2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import './SchoolYearSectionManagement.css';

const DEFAULT_SY_FORM = {
  schoolYear: '',
  semester: '1st',
  isCurrent: false,
  startDate: '',
  endDate: ''
};

const DEFAULT_SECTION_FORM = {
  schoolYearSemester: '',
  sectionName: '',
  yearLevel: '1st Year',
  program: 'BSIT',
  maxStudents: ''
};

const formatSYLabel = (item) => `${item.schoolYear} (${item.semester})`;

const SchoolYearSectionManagement = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [syModalOpen, setSyModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSchoolYear, setEditingSchoolYear] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  const [syForm, setSyForm] = useState(DEFAULT_SY_FORM);
  const [sectionForm, setSectionForm] = useState(DEFAULT_SECTION_FORM);

  const loadData = async () => {
    try {
      setErrorMessage('');
      const [syRes, sectionRes] = await Promise.all([
        axios.get('/api/academic/school-years'),
        axios.get('/api/academic/sections')
      ]);

      setSchoolYears(syRes.data || []);
      setSections(sectionRes.data || []);
    } catch (err) {
      console.error('Failed to load school year/sections:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to load school year and section records.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const schoolYearMap = useMemo(() => {
    const map = new Map();
    schoolYears.forEach((item) => map.set(item._id, item));
    return map;
  }, [schoolYears]);

  const openSYModal = (item = null) => {
    if (item) {
      setEditingSchoolYear(item);
      setSyForm({
        schoolYear: item.schoolYear || '',
        semester: item.semester || '1st',
        isCurrent: Boolean(item.isCurrent),
        startDate: item.startDate ? item.startDate.slice(0, 10) : '',
        endDate: item.endDate ? item.endDate.slice(0, 10) : ''
      });
    } else {
      setEditingSchoolYear(null);
      setSyForm(DEFAULT_SY_FORM);
    }
    setSyModalOpen(true);
  };

  const openSectionModal = (item = null) => {
    if (item) {
      setEditingSection(item);
      setSectionForm({
        schoolYearSemester: item.schoolYearSemester?._id || item.schoolYearSemester || '',
        sectionName: item.sectionName || '',
        yearLevel: item.yearLevel || '1st Year',
        program: item.program || 'BSIT',
        maxStudents: item.maxStudents || ''
      });
    } else {
      setEditingSection(null);
      setSectionForm({
        ...DEFAULT_SECTION_FORM,
        schoolYearSemester: schoolYears[0]?._id || ''
      });
    }
    setSectionModalOpen(true);
  };

  const submitSY = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage('');
      const payload = {
        schoolYear: syForm.schoolYear,
        semester: syForm.semester,
        isCurrent: Boolean(syForm.isCurrent),
        startDate: syForm.startDate || undefined,
        endDate: syForm.endDate || undefined
      };

      if (editingSchoolYear) {
        await axios.put(`/api/academic/school-years/${editingSchoolYear._id}`, payload);
      } else {
        await axios.post('/api/academic/school-years', payload);
      }

      setSyModalOpen(false);
      setEditingSchoolYear(null);
      setSyForm(DEFAULT_SY_FORM);
      await loadData();
    } catch (err) {
      console.error('Failed to save school year:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save school year.');
    }
  };

  const submitSection = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage('');
      const payload = {
        schoolYearSemester: sectionForm.schoolYearSemester,
        sectionName: sectionForm.sectionName,
        yearLevel: sectionForm.yearLevel,
        program: sectionForm.program,
        maxStudents: sectionForm.maxStudents || undefined
      };

      if (editingSection) {
        await axios.put(`/api/academic/sections/${editingSection._id}`, payload);
      } else {
        await axios.post('/api/academic/sections', payload);
      }

      setSectionModalOpen(false);
      setEditingSection(null);
      setSectionForm(DEFAULT_SECTION_FORM);
      await loadData();
    } catch (err) {
      console.error('Failed to save section:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save section.');
    }
  };

  const removeSchoolYear = async (id) => {
    if (!window.confirm('Delete this school year/semester?')) return;

    try {
      setErrorMessage('');
      await axios.delete(`/api/academic/school-years/${id}`);
      await loadData();
    } catch (err) {
      console.error('Failed to delete school year:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to delete school year.');
    }
  };

  const removeSection = async (id) => {
    if (!window.confirm('Delete this section?')) return;

    try {
      setErrorMessage('');
      await axios.delete(`/api/academic/sections/${id}`);
      await loadData();
    } catch (err) {
      console.error('Failed to delete section:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to delete section.');
    }
  };

  return (
    <div className="sys-container">
      {errorMessage && <div className="sys-error">{errorMessage}</div>}

      <div className="sys-header">
        <div>
          <h2>School Year and Sections</h2>
          <p>Manage School Year/Semester records and section offerings used by student profiles.</p>
        </div>
      </div>

      <div className="sys-grid">
        <section className="sys-card">
          <div className="sys-card-header">
            <div className="sys-title-wrap">
              <CalendarRange size={20} />
              <h3>School Year / Semester</h3>
            </div>
            <button className="sys-btn" onClick={() => openSYModal()}>
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="sys-table-wrap">
            <table className="sys-table">
              <thead>
                <tr>
                  <th>School Year</th>
                  <th>Semester</th>
                  <th>Current</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schoolYears.length > 0 ? schoolYears.map((item) => (
                  <tr key={item._id}>
                    <td>{item.schoolYear}</td>
                    <td>{item.semester}</td>
                    <td>{item.isCurrent ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="sys-actions">
                        <button className="sys-icon-btn" onClick={() => openSYModal(item)} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="sys-icon-btn danger" onClick={() => removeSchoolYear(item._id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="sys-empty">No school year records yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="sys-card">
          <div className="sys-card-header">
            <div className="sys-title-wrap">
              <Layers size={20} />
              <h3>Sections</h3>
            </div>
            <button className="sys-btn" onClick={() => openSectionModal()}>
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="sys-table-wrap">
            <table className="sys-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>School Year</th>
                  <th>Year/Program</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.length > 0 ? sections.map((item) => (
                  <tr key={item._id}>
                    <td>{item.sectionName}</td>
                    <td>{item.schoolYearSemester ? formatSYLabel(item.schoolYearSemester) : '-'}</td>
                    <td>{`${item.yearLevel || '-'} / ${item.program || '-'}`}</td>
                    <td>
                      <div className="sys-actions">
                        <button className="sys-icon-btn" onClick={() => openSectionModal(item)} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="sys-icon-btn danger" onClick={() => removeSection(item._id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="sys-empty">No sections yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {syModalOpen && (
        <div className="sys-modal-overlay">
          <div className="sys-modal">
            <div className="sys-modal-header">
              <h4>{editingSchoolYear ? 'Edit School Year/Semester' : 'Add School Year/Semester'}</h4>
              <button onClick={() => setSyModalOpen(false)} className="sys-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitSY} className="sys-form">
              <label>
                School Year
                <input
                  type="text"
                  value={syForm.schoolYear}
                  onChange={(e) => setSyForm((prev) => ({ ...prev, schoolYear: e.target.value }))}
                  placeholder="e.g. 2025-2026"
                  required
                />
              </label>

              <label>
                Semester
                <select
                  value={syForm.semester}
                  onChange={(e) => setSyForm((prev) => ({ ...prev, semester: e.target.value }))}
                >
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="Summer">Summer</option>
                </select>
              </label>

              <label className="sys-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(syForm.isCurrent)}
                  onChange={(e) => setSyForm((prev) => ({ ...prev, isCurrent: e.target.checked }))}
                />
                Mark as current school year/semester
              </label>

              <div className="sys-form-grid">
                <label>
                  Start Date
                  <input
                    type="date"
                    value={syForm.startDate}
                    onChange={(e) => setSyForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </label>
                <label>
                  End Date
                  <input
                    type="date"
                    value={syForm.endDate}
                    onChange={(e) => setSyForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </label>
              </div>

              <div className="sys-form-actions">
                <button type="button" className="sys-btn secondary" onClick={() => setSyModalOpen(false)}>Cancel</button>
                <button type="submit" className="sys-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {sectionModalOpen && (
        <div className="sys-modal-overlay">
          <div className="sys-modal">
            <div className="sys-modal-header">
              <h4>{editingSection ? 'Edit Section' : 'Add Section'}</h4>
              <button onClick={() => setSectionModalOpen(false)} className="sys-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitSection} className="sys-form">
              <label>
                School Year / Semester
                <select
                  value={sectionForm.schoolYearSemester}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, schoolYearSemester: e.target.value }))}
                  required
                >
                  <option value="">Select school year/semester</option>
                  {schoolYears.map((item) => (
                    <option key={item._id} value={item._id}>{formatSYLabel(item)}</option>
                  ))}
                </select>
              </label>

              <label>
                Section Name
                <input
                  type="text"
                  value={sectionForm.sectionName}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, sectionName: e.target.value }))}
                  placeholder="e.g. BSIT-2A"
                  required
                />
              </label>

              <div className="sys-form-grid">
                <label>
                  Year Level
                  <select
                    value={sectionForm.yearLevel}
                    onChange={(e) => setSectionForm((prev) => ({ ...prev, yearLevel: e.target.value }))}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </label>

                <label>
                  Program
                  <select
                    value={sectionForm.program}
                    onChange={(e) => setSectionForm((prev) => ({ ...prev, program: e.target.value }))}
                  >
                    <option value="BSIT">BSIT</option>
                    <option value="BSCS">BSCS</option>
                  </select>
                </label>
              </div>

              <label>
                Max Students (Optional)
                <input
                  type="number"
                  min="1"
                  value={sectionForm.maxStudents}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, maxStudents: e.target.value }))}
                  placeholder="e.g. 40"
                />
              </label>

              <div className="sys-form-actions">
                <button type="button" className="sys-btn secondary" onClick={() => setSectionModalOpen(false)}>Cancel</button>
                <button type="submit" className="sys-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolYearSectionManagement;