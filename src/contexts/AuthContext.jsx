// File: src/contexts/AuthContext.jsx
// Context for managing authentication state

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword as resetPasswordService,
  resendVerificationEmail as resendVerificationEmailService,
  getCurrentUserProfile,
  getToken,
  initializeAuth,
  loginWithGoogle as loginWithGoogleService
} from '../services/authService';

// Firebase configuration - keep for Google sign-in
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase - keep for Google sign-in
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Create context
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  
  // Register function with email verification
  async function register(email, password, profileData) {   
    try {
      setError('');
      console.log("AuthContext register - profileData:", profileData);
      const userData = await registerUser(email, password, profileData);
      console.log("AuthContext register - userData:", userData);
      return userData;
    } catch (err) {
      console.error("AuthContext register error:", err);
      setError(err.message);
      throw err;
    }
  }

  // Login function with email verification check
  async function login(email, password) {
    try {
      setError('');
      const userData = await loginUser(email, password);
      setCurrentUser(userData.user);
      setUserProfile(userData.user);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Google sign in
  async function loginWithGoogle() {
    try {
      setError('');
      const userData = await loginWithGoogleService();
      setCurrentUser(userData.user);
      setUserProfile(userData.user);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Logout function
  async function logout() {
    try {
      setError('');
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Reset password
  async function resetPassword(email) {
    try {
      setError('');
      await resetPasswordService(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Resend verification email
  async function resendVerificationEmail(email) {
    try {
      setError('');
      const result = await resendVerificationEmailService(email);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Fetch user profile from backend
  async function fetchUserProfile() {
    try {
      if (getToken()) {
        const profile = await getCurrentUserProfile();
        setUserProfile(profile);
        setCurrentUser(profile);
        return profile;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  }

  // Initialize auth state
  useEffect(() => {
    // First check if we have a JWT token
    const hasToken = initializeAuth();
    
    if (hasToken) {
      // If we have a token, fetch the user profile
      fetchUserProfile().then(() => {
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      // If no JWT token, listen for Firebase auth state changes (for Google sign-in)
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // If Firebase user exists but no JWT token, we need to get a JWT token
          // This would happen after Google sign-in
          getCurrentUserProfile().then(profile => {
            setUserProfile(profile);
            setCurrentUser(profile);
          }).catch(err => {
            console.error('Error getting user profile after Firebase auth:', err);
          }).finally(() => {
            setLoading(false);
          });
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      });
      
      return unsubscribe;
    }
  }, []);

  const value = {
    currentUser,
    userProfile,
    register,
    login,
    logout,
    resetPassword,
    loginWithGoogle,
    resendVerificationEmail,
    fetchUserProfile,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 