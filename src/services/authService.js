// File: src/services/authService.js
// Authentication service for handling user authentication

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  GoogleAuthProvider
} from '@firebase/auth';
import { auth } from './firebase';
import apiClient from './apiClient';

// Store JWT token in localStorage
const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

// Initialize auth headers from stored token
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }
  return false;
};

// Register a new user
export const registerUser = async (email, password, profileData) => {
  try {
    // Register with backend using JWT
    const response = await apiClient.post('/auth/register', {
      name: profileData.displayName || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
      email,
      password
    });
    
    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    // Authenticate with backend using JWT
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    
    // Store the JWT token
    if (response.data.token) {
      setToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error.response?.data || error;
  }
};

// Login with Google (keep Firebase for this)
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Get the Firebase ID token
    const idToken = await result.user.getIdToken();
    
    // Send the token to your backend to create/update the user
    const response = await apiClient.post('/auth/google-login', {
      idToken,
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL
    });
    
    // Store the JWT token from your backend
    if (response.data.token) {
      setToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error.response?.data || error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    // Logout from backend
    await apiClient.post('/auth/logout');
    
    // Clear the stored token
    setToken(null);
    
    // If user was logged in with Firebase, sign out from there too
    if (auth.currentUser) {
      await auth.signOut();
    }
  } catch (error) {
    console.error('Error logging out:', error);
    // Still clear the token even if the API call fails
    setToken(null);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error.response?.data || error;
  }
};

// Complete password reset with token
export const completePasswordReset = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error completing password reset:', error);
    throw error.response?.data || error;
  }
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    console.error('Error resending verification email:', error);
    throw error.response?.data || error;
  }
};

// Verify email with token
export const verifyEmail = async (token) => {
  try {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error.response?.data || error;
  }
};

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error.response?.data || error;
  }
}; 