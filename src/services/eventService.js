// File: src/services/eventService.js
// Event service for handling family events

import apiClient from './apiClient';

// Get all family events
export const getFamilyEvents = async (userId) => {
  try {
    const response = await apiClient.get(`/events/family/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family events:', error);
    throw error;
  }
};

// Get event details
export const getEvent = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await apiClient.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const response = await apiClient.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Get upcoming events
export const getUpcomingEvents = async (userId, limit = 5) => {
  try {
    const response = await apiClient.get(`/events/upcoming/${userId}?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
}; 