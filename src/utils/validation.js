// File: src/utils/validation.js
// Validation utility functions for form validation

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Name validation (at least 2 characters, letters only)
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

// Date validation (YYYY-MM-DD format)
export const isValidDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

// Required field validation
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Min length validation
export const minLength = (value, min) => {
  return value && value.length >= min;
};

// Max length validation
export const maxLength = (value, max) => {
  return value && value.length <= max;
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  // Process each field according to its rules
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    // Required field validation
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = 'This field is required';
      isValid = false;
      return; // Skip other validations if required fails
    }
    
    // Email validation
    if (fieldRules.email && value && !isValidEmail(value)) {
      errors[field] = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Password validation
    if (fieldRules.password && value && !isValidPassword(value)) {
      errors[field] = 'Password must be at least 8 characters and include a number and a special character';
      isValid = false;
    }
    
    // Minimum length validation
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `Must be at least ${fieldRules.minLength} characters`;
      isValid = false;
    }
    
    // Maximum length validation
    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = `Cannot exceed ${fieldRules.maxLength} characters`;
      isValid = false;
    }
    
    // Pattern validation
    if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.patternMessage || 'Invalid format';
      isValid = false;
    }
    
    // Date validation
    if (fieldRules.date && value && !isValidDate(value)) {
      errors[field] = 'Please enter a valid date';
      isValid = false;
    }
    
    // Custom validation
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(value, data);
      if (customError) {
        errors[field] = customError;
        isValid = false;
      }
    }
  });
  
  return { isValid, errors };
}; 