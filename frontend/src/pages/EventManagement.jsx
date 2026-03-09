import React, { useState } from 'react';
import './EventManagement.css';

const EventManagement = () => {
  const [events, setEvents] = useState(() => {
    try {
      const storedEvents = localStorage.getItem('ccs_events');
      return storedEvents ? JSON.parse(storedEvents) : [];
    } catch {
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const saveToStorage = (updatedEvents) => {
    localStorage.setItem('ccs_events', JSON.stringify(updatedEvents));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedEvents;

    if (formData.id) {
      // Edit
      updatedEvents = events.map((ev) => (ev.id === formData.id ? { ...formData, participants: ev.participants || [] } : ev));
    } else {
      // Create
      const newEvent = {
        ...formData,
        id: Date.now().toString(),
        participants: [] // empty array to hold student IDs or names
      };
      updatedEvents = [...events, newEvent];
    }

    saveToStorage(updatedEvents);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((ev) => ev.id !== id);
      saveToStorage(updatedEvents);
    }
  };

  const toggleStatus = (event) => {
    const newStatus = event.status === 'Upcoming' ? 'Ongoing' : event.status === 'Ongoing' ? 'Completed' : 'Upcoming';
    const updatedEvents = events.map((ev) => (ev.id === event.id ? { ...ev, status: newStatus } : ev));
    saveToStorage(updatedEvents);
  };

  return (
    <div className="event-management-container">
      <div className="event-management-header">
        <h2>Event Management</h2>
        <button className="primary-btn" onClick={() => openModal()}>+ Create New Event</button>
      </div>

      <div className="event-list">
        {events.length === 0 ? (
          <div className="no-events">No events found. Create one to get started!</div>
        ) : (
          <table className="event-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Participants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    <strong>{ev.title}</strong>
                    <div className="event-desc-preview">{ev.description.substring(0, 30)}{ev.description.length > 30 ? '...' : ''}</div>
                  </td>
                  <td>
                    <div>{ev.date}</div>
                    <div className="event-time">{ev.time}</div>
                  </td>
                  <td>{ev.location}</td>
                  <td>
                    <div className="participant-count">
                      {ev.participants ? ev.participants.length : 0} / {ev.maxParticipants}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${ev.status.toLowerCase()}`}>
                       {ev.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                     <button className="icon-btn edit-btn" title="Edit" onClick={() => openModal(ev)}>✎</button>
                     <button className="icon-btn status-btn" title="Cycle Status" onClick={() => toggleStatus(ev)}>↺</button>
                     <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(ev.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="event-modal">
            <div className="modal-header">
              <h3>{formData.id ? 'Edit Event' : 'Create New Event'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="event-form-group">
                <label>Event Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="event-form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3}></textarea>
              </div>
              <div className="event-form-row">
                <div className="event-form-group">
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="event-form-group">
                  <label>Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="event-form-row">
                <div className="event-form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                </div>
                <div className="event-form-group">
                  <label>Max Participants</label>
                  <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} required min="1" />
                </div>
              </div>
              <div className="event-form-group">
                <label>Initial Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="event-form-actions">
                <button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="primary-btn">{formData.id ? 'Save Changes' : 'Create Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
