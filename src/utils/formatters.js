// File: src/utils/formatters.js
// Formatting utilities for dates, numbers, and other data

// Format date to readable string (e.g., "January 1, 2023")
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date to short format (e.g., "Jan 1, 2023")
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time (e.g., "2:30 PM")
export const formatTime = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  // For messages from today, show only the time
  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // For messages from yesterday
  if (diffInDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // For messages from this week (less than 7 days ago)
  if (diffInDays < 7) {
    const options = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString([], options);
  }
  
  // For older messages
  const options = { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  };
  
  // Add year if it's not the current year
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }
  
  return date.toLocaleString([], options);
};

// Format date and time (e.g., "January 1, 2023 at 2:30 PM")
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

// Format file size (e.g., "1.5 MB")
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format phone number (e.g., "(123) 456-7890")
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length > 10) {
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }
  
  // If the number doesn't match expected formats, return as is
  return phoneNumber;
};

// Calculate age from birth date
export const calculateAge = (birthDateString) => {
  if (!birthDateString) return '';
  
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return '';
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Format name (e.g., "John Doe" or "Doe, John")
export const formatName = (firstName, lastName, lastNameFirst = false) => {
  if (!firstName && !lastName) return '';
  
  if (lastNameFirst) {
    return lastName ? `${lastName}, ${firstName || ''}` : firstName;
  }
  
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Format a number with commas as thousands separators
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Truncate a string to a specified length and add ellipsis
export const truncateString = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}; 