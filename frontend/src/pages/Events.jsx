import React, { useState, useEffect } from 'react';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState(() => {
    try {
      const storedEvents = localStorage.getItem('ccs_events');
      return storedEvents ? JSON.parse(storedEvents) : [];
    } catch {
      return [];
    }
  });
  
  // Mock current student ID
  const currentStudentId = 'stu_12345';

  useEffect(() => {
    // Listen for storage changes if Admin edits in another tab
    const handleStorageChange = (e) => {
      if (e.key === 'ccs_events') {
        try {
          setEvents(JSON.parse(e.newValue) || []);
        } catch {
          setEvents([]);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleApply = (eventId) => {
    const updatedEvents = events.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          participants: [...(ev.participants || []), currentStudentId]
        };
      }
      return ev;
    });

    localStorage.setItem('ccs_events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleCancelApplication = (eventId) => {
    const updatedEvents = events.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          participants: (ev.participants || []).filter(id => id !== currentStudentId)
        };
      }
      return ev;
    });

    localStorage.setItem('ccs_events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  return (
    <div className="events-view-container">
      <div className="events-header">
        <h2>Available Events</h2>
        <p>Discover and join upcoming events hosted by the College of Computing Studies.</p>
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="no-events-view">There are no upcoming events at the moment. Please check back later.</div>
        ) : (
          events.map((ev) => {
            const participants = ev.participants || [];
            const hasApplied = participants.includes(currentStudentId);
            const isFull = participants.length >= parseInt(ev.maxParticipants);
            const isUpcoming = ev.status === 'Upcoming';

            return (
              <div key={ev.id} className="event-card">
                <div className={`event-status-label ${ev.status.toLowerCase()}`}>
                  {ev.status}
                </div>
                <h3 className="event-card-title">{ev.title}</h3>
                <p className="event-card-desc">{ev.description}</p>
                
                <div className="event-details">
                  <div className="event-detail-item">
                    <span className="icon">📅</span>
                    <span>{ev.date} at {ev.time}</span>
                  </div>
                  <div className="event-detail-item">
                    <span className="icon">📍</span>
                    <span>{ev.location}</span>
                  </div>
                  <div className="event-detail-item">
                    <span className="icon">👥</span>
                    <span>{participants.length} / {ev.maxParticipants} Participants</span>
                  </div>
                </div>

                <div className="event-actions">
                  {hasApplied ? (
                    <button className="apply-btn cancel" onClick={() => handleCancelApplication(ev.id)}>
                      Cancel Application
                    </button>
                  ) : (
                    <button 
                      className="apply-btn" 
                      onClick={() => handleApply(ev.id)}
                      disabled={isFull || !isUpcoming}
                    >
                      {isFull ? 'Event Full' : !isUpcoming ? 'Registration Closed' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Events;
