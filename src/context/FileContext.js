// File: src/context/FileContext.js
// Context for managing file storage

import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from '@firebase/storage';
import { storage } from '../services/firebase';

// Create context
export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  // Fetch all files
  const fetchFiles = async () => {
    if (!currentUser) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files`, {
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload a file
  const uploadFile = async (file, metadata = {}) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      // Create a storage reference
      const storageRef = ref(storage, `users/${currentUser.uid}/${file.name}`);
      
      // Upload file to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Track upload progress
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          },
          (error) => {
            console.error('Error uploading file:', error);
            setError(error.message);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              // Get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              // Save file metadata to backend
              const fileData = {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                downloadUrl: downloadURL,
                ...metadata
              };
              
              const response = await fetch(`${process.env.REACT_APP_API_URL}/files`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${await currentUser.getIdToken()}`
                },
                body: JSON.stringify(fileData)
              });
              
              if (!response.ok) {
                throw new Error('Failed to save file metadata');
              }
              
              const savedFile = await response.json();
              
              // Update local state
              setFiles(prevFiles => [...prevFiles, savedFile]);
              
              // Clear progress
              setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[file.name];
                return newProgress;
              });
              
              resolve(savedFile);
            } catch (error) {
              console.error('Error saving file metadata:', error);
              setError(error.message);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error initiating file upload:', error);
      setError(error.message);
      throw error;
    }
  };

  // Delete a file
  const deleteFile = async (fileId) => {
    if (!currentUser || !fileId) {
      throw new Error('User not authenticated or file ID not provided');
    }

    try {
      // Get file data
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file data');
      }

      const fileData = await response.json();
      
      // Delete from Firebase Storage
      if (fileData.downloadUrl) {
        const storageRef = ref(storage, fileData.downloadUrl);
        await deleteObject(storageRef);
      }
      
      // Delete from backend
      const deleteResponse = await fetch(`${process.env.REACT_APP_API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete file');
      }

      // Update local state
      setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      setError(error.message);
      throw error;
    }
  };

  // Fetch files when user changes
  useEffect(() => {
    fetchFiles();
  }, [currentUser]);

  const value = {
    files,
    loading,
    error,
    uploadProgress,
    fetchFiles,
    uploadFile,
    deleteFile
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
}; 