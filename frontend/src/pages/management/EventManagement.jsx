import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Search, Filter, CalendarDays, 
  CheckCircle, Settings, Edit, Trash2, RefreshCw, Plus, X, ListTodo
} from 'lucide-react';
import axios from 'axios';
import './EventManagement.css';

const normalizeEvent = (ev) => ({
  id: ev._id || ev.id,
  title: ev.title || '',
  description: ev.description || '',
  date: ev.date || '',
  time: ev.time || '',
  location: ev.location || '',
  maxParticipants: ev.maxParticipants || '',
  status: ev.status || 'Upcoming',
  participants: (ev.participants || []).map((participant) => ({
    id: participant._id || participant.id || participant,
    userId: participant.userId || '',
    name: participant.name || '',
    email: participant.email || '',
    role: participant.role || ''
  })),
  applications: (ev.applications || []).map((app) => ({
    id: app._id || app.id,
    applicationStatus: app.applicationStatus || 'Pending',
    role: app.role || 'Participant',
    applicationDate: app.applicationDate || '',
    remarks: app.remarks || '',
    user: {
      id: app.user?._id || app.user?.id || app.user,
      userId: app.user?.userId || '',
      name: app.user?.name || '',
      email: app.user?.email || '',
      role: app.user?.role || ''
    }
  }))
});

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events');
      setEvents(response.data.map(normalizeEvent));
    } catch (error) {
      console.error('Failed to load events:', error);
      setErrorMessage('Failed to load events from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    status: 'Upcoming'
  });

  // Empty effect removed since state is initialized synchronously

  const saveToServer = (updatedEvents) => {
    setEvents(updatedEvents);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (event = null) => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        id: null,
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        status: 'Upcoming'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openParticipantsModal = (event) => {
    setSelectedEvent(event);
    setIsParticipantsModalOpen(true);
  };

  const closeParticipantsModal = () => {
    setIsParticipantsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleReviewApplication = async (eventId, applicationId, status) => {
    try {
      const response = await axios.put(`/api/events/${eventId}/applications/${applicationId}/review`, { status });
      const updatedEvent = normalizeEvent(response.data);
      setEvents((prev) => prev.map((ev) => (ev.id === eventId ? updatedEvent : ev)));
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(updatedEvent);
      }
    } catch (error) {
      console.error('Failed to review application:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to review application.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      maxParticipants: Number(formData.maxParticipants)
    };

    if (formData.id) {
      // Edit
      axios.put(`/api/events/${formData.id}`, payload).then((response) => {
        const updated = events.map((ev) => ev.id === formData.id ? normalizeEvent(response.data) : ev);
        saveToServer(updated);
        closeModal();
      }).catch((error) => {
        console.error('Failed to update event:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to update event.');
      });
    } else {
      // Create
      axios.post('/api/events', payload).then((response) => {
        const newEvent = normalizeEvent(response.data);
        saveToServer([...events, newEvent]);
        closeModal();
      }).catch((error) => {
        console.error('Failed to create event:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to create event.');
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      axios.delete(`/api/events/${id}`).then(() => {
        const updatedEvents = events.filter((ev) => ev.id !== id);
        saveToServer(updatedEvents);
      }).catch((error) => {
        console.error('Failed to delete event:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to delete event.');
      });
    }
  };

  const toggleStatus = (event) => {
    const newStatus = event.status === 'Upcoming' ? 'Ongoing' : event.status === 'Ongoing' ? 'Completed' : 'Upcoming';
    axios.put(`/api/events/${event.id}`, { status: newStatus }).then((response) => {
      const updatedEvents = events.map((ev) => (ev.id === event.id ? normalizeEvent(response.data) : ev));
      saveToServer(updatedEvents);
    }).catch((error) => {
      console.error('Failed to update event status:', error);
    });
  };

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchesSearch = 
        ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ev.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || ev.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'Upcoming').length,
    ongoing: events.filter(e => e.status === 'Ongoing').length,
    completed: events.filter(e => e.status === 'Completed').length
  };

  return (
    <div className="event-management-container">
      <div className="admin-header-section">
        <div className="admin-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Calendar size={28} color="var(--primary-color)" />
            <h2 style={{ margin: 0 }}>Event Management</h2>
          </div>
          <p>Create, track, and manage all events for the campus easily.</p>
        </div>
        <div className="admin-header-actions">
          <button className="primary-btn add-btn" onClick={() => openModal()}>
            <Plus size={18} />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card total">
          <div className="admin-stat-icon-wrapper">
            <ListTodo size={24} className="admin-stat-icon" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.total}</span>
            <span className="admin-stat-label">Total Events</span>
          </div>
        </div>
        <div className="admin-stat-card upcoming">
          <div className="admin-stat-icon-wrapper">
            <CalendarDays size={24} className="admin-stat-icon" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.upcoming}</span>
            <span className="admin-stat-label">Upcoming</span>
          </div>
        </div>
        <div className="admin-stat-card ongoing">
          <div className="admin-stat-icon-wrapper">
            <Settings size={24} className="admin-stat-icon" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.ongoing}</span>
            <span className="admin-stat-label">Ongoing</span>
          </div>
        </div>
        <div className="admin-stat-card completed">
          <div className="admin-stat-icon-wrapper">
            <CheckCircle size={24} className="admin-stat-icon" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.completed}</span>
            <span className="admin-stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="admin-search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title or location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>
        
        <div className="admin-filter-wrapper">
          <Filter size={18} className="filter-icon" />
          <div className="admin-filter-pills">
            {['All', 'Upcoming', 'Ongoing', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`admin-filter-pill ${statusFilter === status ? 'active' : ''}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="event-list-wrapper">
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}
        {loading ? (
          <div className="admin-no-results">
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="admin-no-results">
             <ListTodo size={40} className="empty-icon" />
             <p>No events found. Adjust filters or create a new one.</p>
          </div>
        ) : (
          <table className="event-table">
            <thead>
              <tr>
                <th>Event Info</th>
                <th>Schedule</th>
                <th>Participant Metrics</th>
                <th>Status</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => {
                const partsCount = (ev.participants || []).length;
                const maxParts = parseInt(ev.maxParticipants) || 0;
                const progress = maxParts > 0 ? Math.min((partsCount / maxParts) * 100, 100) : 0;
                
                return (
                  <tr key={ev.id}>
                    <td>
                      <strong className="event-row-title">{ev.title}</strong>
                      <div className="event-row-location">
                        <MapPin size={12} /> {ev.location}
                      </div>
                    </td>
                    <td>
                      <div className="event-row-date">
                        <Calendar size={12} /> {ev.date}
                      </div>
                      <div className="event-row-time">
                        <Clock size={12} /> {ev.time}
                      </div>
                    </td>
                    <td>
                      <div className="event-capacity-cell">
                        <div className="capacity-numbers">
                           <Users size={12} /> {partsCount} / {maxParts}
                        </div>
                        {maxParts > 0 && (
                          <div className="capacity-mini-bar">
                            <div 
                              className={`capacity-mini-fill ${progress >= 100 ? 'full' : progress > 80 ? 'warning' : ''}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${ev.status?.toLowerCase()}`}>
                         {ev.status}
                      </span>
                    </td>
                    <td>
                       <div className="actions-cell">
                         <button className="table-action-btn view" title="View Applications" onClick={() => openParticipantsModal(ev)}>
                           <Users size={16} />
                         </button>
                         <button className="table-action-btn edit" title="Edit" onClick={() => openModal(ev)}>
                           <Edit size={16} />
                         </button>
                         <button className="table-action-btn rotate" title="Cycle Status" onClick={() => toggleStatus(ev)}>
                           <RefreshCw size={16} />
                         </button>
                         <button className="table-action-btn delete" title="Delete" onClick={() => handleDelete(ev.id)}>
                           <Trash2 size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>{formData.id ? 'Edit Event' : 'Create New Event'}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-event-form">
              <div className="admin-form-group">
                <label>Event Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Web Dev Workshop" required />
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the event purpose and details..." required rows={3}></textarea>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="admin-form-group">
                  <label>Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Room, Lab, or Link" required />
                </div>
                <div className="admin-form-group">
                  <label>Capacity</label>
                  <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} placeholder="Maximum attendees" required min="1" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{formData.id ? 'Save Changes' : 'Publish Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isParticipantsModalOpen && selectedEvent && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: '860px' }}>
            <div className="admin-modal-header">
              <h3>Applications & Participants: {selectedEvent.title}</h3>
              <button className="modal-close-btn" onClick={closeParticipantsModal}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              {(() => {
                const pendingApplications = (selectedEvent.applications || []).filter((application) => application.applicationStatus === 'Pending');
                const rejectedApplications = (selectedEvent.applications || []).filter((application) => application.applicationStatus === 'Rejected');

                return (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <strong>Pending Applications ({pendingApplications.length})</strong>
                      <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>
                        Only pending applications are listed here for approval.
                      </p>
                    </div>
                    {pendingApplications.length === 0 ? (
                      <div className="admin-no-results" style={{ padding: '12px 0 20px' }}>
                        <p>No pending applications.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px', maxHeight: '260px', overflowY: 'auto', marginBottom: '18px' }}>
                        {pendingApplications.map((application, index) => (
                          <div key={application.id || index} style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                              <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>{application.user?.name || 'Unnamed Applicant'}</strong>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{application.user?.userId || 'No user ID'}</div>
                                {application.user?.email && <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{application.user.email}</div>}
                              </div>
                              <span className={`status-badge ${application.applicationStatus.toLowerCase()}`}>{application.applicationStatus}</span>
                            </div>
                            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                              <button
                                className="btn-primary"
                                type="button"
                                style={{ padding: '8px 12px' }}
                                onClick={() => handleReviewApplication(selectedEvent.id, application.id, 'Approved')}
                              >
                                Approve
                              </button>
                              <button
                                className="btn-secondary"
                                type="button"
                                style={{ padding: '8px 12px' }}
                                onClick={() => handleReviewApplication(selectedEvent.id, application.id, 'Rejected')}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ marginBottom: '10px' }}>
                      <strong>Rejected Applications ({rejectedApplications.length})</strong>
                    </div>
                    {rejectedApplications.length === 0 ? (
                      <div className="admin-no-results" style={{ padding: '6px 0 12px' }}>
                        <p>No rejected applications.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '8px', maxHeight: '160px', overflowY: 'auto', marginBottom: '18px' }}>
                        {rejectedApplications.map((application, index) => (
                          <div key={application.id || index} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                              <div>
                                <strong style={{ display: 'block' }}>{application.user?.name || 'Unnamed Applicant'}</strong>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{application.user?.userId || 'No user ID'}</div>
                              </div>
                              <span className={`status-badge ${application.applicationStatus.toLowerCase()}`}>{application.applicationStatus}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}

              <div style={{ marginBottom: '10px' }}>
                <strong>Approved Participants ({selectedEvent.participants.length})</strong>
              </div>
              {selectedEvent.participants.length === 0 ? (
                <div className="admin-no-results" style={{ padding: '6px 0 12px' }}>
                  <p>No approved participants yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {selectedEvent.participants.map((participant, index) => (
                    <div key={participant.id || index} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
                      <strong style={{ display: 'block' }}>{participant.name || 'Unnamed Participant'}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{participant.userId || 'No user ID'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
