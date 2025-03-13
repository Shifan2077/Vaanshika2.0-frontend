// File: src/hooks/useFileStorage.js
// Custom hook for using the FileContext

import { useContext } from 'react';
import { FileContext } from '../context/FileContext';

export const useFileStorage = () => {
  const context = useContext(FileContext);
  
  if (!context) {
    throw new Error('useFileStorage must be used within a FileProvider');
  }
  
  return context;
}; 