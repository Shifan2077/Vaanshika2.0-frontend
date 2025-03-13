// File: src/utils/errorHandlers.js
// Utility functions for error handling

// Parse and format API error responses
export const parseApiError = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // Handle axios error objects
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;
    
    if (status === 401) {
      return 'Authentication failed. Please log in again.';
    }
    
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (status === 404) {
      return 'The requested resource was not found.';
    }
    
    if (status === 500) {
      return 'A server error occurred. Please try again later.';
    }
    
    // Try to extract error message from response data
    if (data) {
      if (typeof data === 'string') {
        return data;
      }
      
      if (data.message) {
        return data.message;
      }
      
      if (data.error) {
        return data.error;
      }
    }
    
    return `Error ${status}: An error occurred`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
  
  // For non-axios errors or unknown error structures
  return error.toString();
};

// Handle Firebase authentication errors
export const parseFirebaseAuthError = (error) => {
  const errorCode = error.code || '';
  
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please use a different email or try logging in.',
    'auth/invalid-email': 'The email address is not valid. Please check and try again.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please check or register.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/invalid-credential': 'Invalid login credentials. Please check and try again.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
    'auth/requires-recent-login': 'This operation requires recent authentication. Please log in again.',
    'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing the sign-in.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
    'auth/invalid-api-key': 'The Firebase API key is invalid. Please check your configuration.',
  };
  
  return errorMessages[errorCode] || error.message || 'An unknown error occurred. Please try again.';
};

// Log errors to console with additional context
export const logError = (error, context = {}) => {
  console.error('Error:', error, 'Context:', context);
  // In production, you might send this to a logging service
};

// Create a global error handler for uncaught exceptions
export const setupGlobalErrorHandler = () => {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // You could send this to a logging service
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send this to a logging service
  });
}; 