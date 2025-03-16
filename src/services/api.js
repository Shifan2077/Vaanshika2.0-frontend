// File: src/services/api.js
// API service for making HTTP requests to the backend

import axios from 'axios';
import { getAuth } from '@firebase/auth';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status code
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - handle auth errors
          console.error('Authentication error:', data.message || 'Unauthorized');
          // You could trigger a logout or redirect to login here
          break;
        case 403:
          // Forbidden - handle permission errors
          console.error('Permission error:', data.message || 'Forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message || 'Not found');
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message || 'Internal server error');
          break;
        default:
          // Other errors
          console.error('API error:', data.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response received');
    } else {
      // Error in setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 