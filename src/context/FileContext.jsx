// File: src/context/FileContext.jsx
// File context for managing family media and documents

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFamilyFiles } from '../services/fileService';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadFiles = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getFamilyFiles(currentUser.uid);
        setFiles(data);
        setError(null);
      } catch (err) {
        setError('Failed to load family files');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [currentUser]);

  const value = {
    files,
    setFiles,
    loading,
    error,
    setError
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
}; 