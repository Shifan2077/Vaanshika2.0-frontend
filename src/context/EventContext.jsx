// File: src/context/EventContext.jsx
// Event context for managing family events and calendar

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFamilyEvents } from '../services/eventService';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getFamilyEvents(currentUser.uid);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError('Failed to load family events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [currentUser]);

  const value = {
    events,
    setEvents,
    loading,
    error,
    setError
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 