// File: src/services/fileService.js
// File service for handling file uploads and storage

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@firebase/storage';
import { storage } from './firebase';
import apiClient from './apiClient';

// Get all family files
export const getFamilyFiles = async (userId) => {
  try {
    const response = await apiClient.get(`/files/family/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family files:', error);
    throw error;
  }
};

// Upload a file to Firebase Storage
export const uploadFile = async (file, path, metadata = {}) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            path,
            metadata: uploadTask.snapshot.metadata
          });
        }
      );
    });
  } catch (error) {
    console.error('Error in upload process:', error);
    throw error;
  }
};

// Save file metadata to the database
export const saveFileMetadata = async (fileData) => {
  try {
    const response = await apiClient.post('/files', fileData);
    return response.data;
  } catch (error) {
    console.error('Error saving file metadata:', error);
    throw error;
  }
};

// Delete a file
export const deleteFile = async (fileId, storagePath) => {
  try {
    // Delete from Firebase Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    // Delete metadata from database
    const response = await apiClient.delete(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get file details
export const getFileDetails = async (fileId) => {
  try {
    const response = await apiClient.get(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching file details:', error);
    throw error;
  }
}; 