// File: src/services/apiClient.js
// API client for making requests to the backend

import axios from 'axios';
// Keep Firebase auth for Google sign-in
import { auth } from './firebase';
import { getToken } from './authService';

// Create an axios instance with base URL
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // First try to get JWT token from localStorage
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
    
    // If no JWT token, try to get Firebase token (for Google sign-in)
    const user = auth.currentUser;
    if (user) {
      try {
        const firebaseToken = await user.getIdToken();
        config.headers.Authorization = `Bearer ${firebaseToken}`;
      } catch (error) {
        console.error('Error getting Firebase auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error Response (${error.response.status}):`, error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Unauthorized - could trigger a sign out or refresh token
        console.warn('Authentication error: User is not authenticated');
        // Clear token on auth error
        localStorage.removeItem('auth_token');
      }
      
      // Handle forbidden errors
      if (error.response.status === 403) {
        console.warn('Authorization error: User does not have permission');
      }
      
      // Handle not found errors
      if (error.response.status === 404) {
        console.warn('Resource not found');
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 