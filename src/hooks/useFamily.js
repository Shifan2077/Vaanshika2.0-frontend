// File: src/hooks/useFamily.js
// Custom hook for using the FamilyContext

import { useContext } from 'react';
import FamilyContext from '../contexts/FamilyContext';

export const useFamily = () => {
  const context = useContext(FamilyContext);
  
  if (!context) {
    console.error('useFamily hook used outside of FamilyProvider');
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  
  return context;
};

export default useFamily; 