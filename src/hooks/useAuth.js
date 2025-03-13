// File: src/hooks/useAuth.js
// Custom hook for accessing auth context

import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}

export default useAuth; 