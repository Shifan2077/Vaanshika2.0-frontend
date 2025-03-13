// File: src/context/FamilyContext.jsx
// Family context for managing family tree data

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFamilyTree } from '../services/familyService';

export const FamilyContext = createContext();

export const FamilyProvider = ({ children }) => {
  const [familyTree, setFamilyTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadFamilyTree = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getFamilyTree(currentUser.uid);
        setFamilyTree(data);
        setError(null);
      } catch (err) {
        setError('Failed to load family tree data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFamilyTree();
  }, [currentUser]);

  const value = {
    familyTree,
    setFamilyTree,
    loading,
    error,
    setError
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
}; 