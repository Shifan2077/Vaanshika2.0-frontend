// File: src/context/EventContext.js
// Context for managing family events

import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

// Create context
export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    if (!currentUser) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/events`, {
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get a specific event
  const getEvent = async (eventId) => {
    if (!currentUser || !eventId) {
      throw new Error('User not authenticated or event ID not provided');
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      setError(error.message);
      throw error;
    }
  };

  // Add a new event
  const addEvent = async (eventData) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      const newEvent = await response.json();
      
      // Update local state
      setEvents(prevEvents => [...prevEvents, newEvent]);

      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      setError(error.message);
      throw error;
    }
  };

  // Update an existing event
  const updateEvent = async (eventId, eventData) => {
    if (!currentUser || !eventId) {
      throw new Error('User not authenticated or event ID not provided');
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const updatedEvent = await response.json();
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => event._id === eventId ? updatedEvent : event)
      );

      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      setError(error.message);
      throw error;
    }
  };

  // Remove an event
  const removeEvent = async (eventId) => {
    if (!currentUser || !eventId) {
      throw new Error('User not authenticated or event ID not provided');
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove event');
      }

      // Update local state
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));

      return true;
    } catch (error) {
      console.error('Error removing event:', error);
      setError(error.message);
      throw error;
    }
  };

  // Fetch events when user changes
  useEffect(() => {
    fetchEvents();
  }, [currentUser]);

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    getEvent,
    addEvent,
    updateEvent,
    removeEvent
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 