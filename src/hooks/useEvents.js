// File: src/hooks/useEvents.js
// Custom hook for events management with functions for fetching, creating, updating, and deleting events

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import api from '../services/api';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for managing family events
 * Provides functions for fetching, creating, updating, and deleting events
 */
export const useEvents = () => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Get all events
   * @returns {Promise<Array>} - Array of events
   */
  const getEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/events');
      
      // For demo purposes, if the API doesn't return data yet, return mock data
      if (!response.data || response.data.length === 0) {
        return getMockEvents();
      }
      
      return response.data;
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
      
      // Return mock data for demo purposes
      return getMockEvents();
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a specific event by ID
   * @param {string} eventId - The ID of the event to fetch
   * @returns {Promise<Object>} - The event object
   */
  const getEventById = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err.message || 'Failed to fetch event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new event
   * @param {Object} eventData - The event data
   * @returns {Promise<Object>} - The created event
   */
  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event');
      
      // For demo purposes, return a mock event with the provided data
      return {
        id: uuidv4(),
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.uid || 'demo-user'
      };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Update an existing event
   * @param {string} eventId - The ID of the event to update
   * @param {Object} eventData - The updated event data
   * @returns {Promise<Object>} - The updated event
   */
  const updateEvent = useCallback(async (eventId, eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message || 'Failed to update event');
      
      // For demo purposes, return the updated event data
      return {
        id: eventId,
        ...eventData,
        updatedAt: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete an event
   * @param {string} eventId - The ID of the event to delete
   * @returns {Promise<void>}
   */
  const deleteEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/events/${eventId}`);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get events by date range
   * @param {Date} startDate - The start date
   * @param {Date} endDate - The end date
   * @returns {Promise<Array>} - Array of events within the date range
   */
  const getEventsByDateRange = useCallback(async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/events', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      
      return response.data;
    } catch (err) {
      console.error('Error fetching events by date range:', err);
      setError(err.message || 'Failed to fetch events by date range');
      
      // For demo purposes, filter mock events by date range
      const mockEvents = getMockEvents();
      return mockEvents.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= startDate && eventStart <= endDate;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get upcoming events
   * @param {number} limit - The maximum number of events to return
   * @returns {Promise<Array>} - Array of upcoming events
   */
  const getUpcomingEvents = useCallback(async (limit = 5) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/events/upcoming', {
        params: { limit }
      });
      
      return response.data;
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      setError(err.message || 'Failed to fetch upcoming events');
      
      // For demo purposes, return upcoming mock events
      const mockEvents = getMockEvents();
      const now = new Date();
      
      return mockEvents
        .filter(event => new Date(event.start) >= now)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, limit);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mock data function for demo purposes
  const getMockEvents = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    return [
      {
        id: '1',
        title: 'Family Dinner',
        description: 'Weekly family dinner at grandma\'s house',
        start: new Date(today.setHours(18, 0, 0, 0)).toISOString(),
        end: new Date(today.setHours(20, 0, 0, 0)).toISOString(),
        location: 'Grandma\'s House',
        allDay: false,
        color: '#4CAF50',
        attendees: [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Doe' },
          { id: '3', name: 'Grandma Smith' }
        ],
        createdAt: '2023-06-01T10:00:00Z',
        updatedAt: '2023-06-01T10:00:00Z',
        createdBy: 'user1'
      },
      {
        id: '2',
        title: 'Birthday Party',
        description: 'Sarah\'s 10th birthday party',
        start: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
        end: new Date(tomorrow.setHours(17, 0, 0, 0)).toISOString(),
        location: 'Fun Zone Play Area',
        allDay: false,
        color: '#FF9800',
        attendees: [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Doe' },
          { id: '4', name: 'Sarah Doe' },
          { id: '5', name: 'Mike Johnson' }
        ],
        createdAt: '2023-06-05T11:30:00Z',
        updatedAt: '2023-06-05T11:30:00Z',
        createdBy: 'user1'
      },
      {
        id: '3',
        title: 'Family Reunion',
        description: 'Annual family reunion at the lake house',
        start: new Date(nextWeek.setHours(10, 0, 0, 0)).toISOString(),
        end: new Date(nextWeek.setHours(18, 0, 0, 0)).toISOString(),
        location: 'Lake House',
        allDay: true,
        color: '#2196F3',
        attendees: [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Doe' },
          { id: '3', name: 'Grandma Smith' },
          { id: '4', name: 'Sarah Doe' },
          { id: '5', name: 'Mike Johnson' },
          { id: '6', name: 'Emily Wilson' }
        ],
        createdAt: '2023-05-15T09:45:00Z',
        updatedAt: '2023-05-15T09:45:00Z',
        createdBy: 'user2'
      },
      {
        id: '4',
        title: 'Wedding Anniversary',
        description: 'John and Jane\'s 15th wedding anniversary',
        start: new Date(nextMonth.setHours(19, 0, 0, 0)).toISOString(),
        end: new Date(nextMonth.setHours(22, 0, 0, 0)).toISOString(),
        location: 'Fancy Restaurant',
        allDay: false,
        color: '#E91E63',
        attendees: [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Doe' }
        ],
        createdAt: '2023-06-10T14:20:00Z',
        updatedAt: '2023-06-10T14:20:00Z',
        createdBy: 'user1'
      },
      {
        id: '5',
        title: 'Doctor Appointment',
        description: 'Annual checkup for the kids',
        start: new Date(today.setDate(today.getDate() + 3)).toISOString(),
        end: new Date(today.setHours(today.getHours() + 1)).toISOString(),
        location: 'Family Clinic',
        allDay: false,
        color: '#9C27B0',
        attendees: [
          { id: '2', name: 'Jane Doe' },
          { id: '4', name: 'Sarah Doe' }
        ],
        createdAt: '2023-06-12T08:15:00Z',
        updatedAt: '2023-06-12T08:15:00Z',
        createdBy: 'user1'
      }
    ];
  };

  return {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDateRange,
    getUpcomingEvents,
    error,
    loading
  };
};

export default useEvents; 