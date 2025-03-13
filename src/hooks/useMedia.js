// File: src/hooks/useMedia.js
// Custom hook for media management with functions for fetching, uploading, and managing media items

import { useState, useCallback, useContext } from 'react';
import { useAuth } from './useAuth';
import api from '../services/api';
import { storage } from '../services/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for managing media items (photos, videos, etc.)
 * Provides functions for fetching, uploading, and managing media
 */
export const useMedia = () => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Get all media items or items from a specific album
   * @param {string} albumId - Optional album ID to filter by
   * @returns {Promise<Array>} - Array of media items
   */
  const getMediaItems = useCallback(async (albumId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/media';
      if (albumId) {
        url += `?albumId=${albumId}`;
      }
      
      const response = await api.get(url);
      
      // For demo purposes, if the API doesn't return data yet, return mock data
      if (!response.data || response.data.length === 0) {
        return getMockMediaItems(albumId);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error fetching media items:', err);
      setError(err.message || 'Failed to fetch media items');
      
      // Return mock data for demo purposes
      return getMockMediaItems(albumId);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all albums
   * @returns {Promise<Array>} - Array of albums
   */
  const getAlbums = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/albums');
      
      // For demo purposes, if the API doesn't return data yet, return mock data
      if (!response.data || response.data.length === 0) {
        return getMockAlbums();
      }
      
      return response.data;
    } catch (err) {
      console.error('Error fetching albums:', err);
      setError(err.message || 'Failed to fetch albums');
      
      // Return mock data for demo purposes
      return getMockAlbums();
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload a media file
   * @param {File} file - The file to upload
   * @param {Object} options - Upload options
   * @param {string} options.albumId - Optional album ID to associate with the file
   * @param {Function} options.onProgress - Optional progress callback
   * @returns {Promise<Object>} - The uploaded media item
   */
  const uploadMedia = useCallback(async (file, options = {}) => {
    const { albumId, onProgress } = options;
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Upload file to Firebase Storage
      const fileId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;
      const storageRef = ref(storage, `media/${user.uid}/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Return a promise that resolves when the upload is complete
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Calculate and report progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            // Handle upload error
            console.error('Error uploading file:', error);
            setError(error.message || 'Failed to upload file');
            setLoading(false);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              // Get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              // 2. Create media item in the database
              const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
              
              const mediaData = {
                title: file.name.split('.')[0],
                description: '',
                type: mediaType,
                url: downloadURL,
                thumbnail: mediaType === 'image' ? downloadURL : null, // For videos, we'd generate a thumbnail
                size: file.size,
                albumId: albumId || null,
                tags: []
              };
              
              // Save to database
              const response = await api.post('/media', mediaData);
              
              setLoading(false);
              resolve(response.data);
            } catch (err) {
              console.error('Error saving media data:', err);
              setError(err.message || 'Failed to save media data');
              setLoading(false);
              reject(err);
            }
          }
        );
      });
    } catch (err) {
      console.error('Error in uploadMedia:', err);
      setError(err.message || 'Failed to upload media');
      setLoading(false);
      throw err;
    }
  }, [user]);

  /**
   * Delete a media item
   * @param {string} mediaId - The ID of the media item to delete
   * @returns {Promise<void>}
   */
  const deleteMedia = useCallback(async (mediaId) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/media/${mediaId}`);
    } catch (err) {
      console.error('Error deleting media:', err);
      setError(err.message || 'Failed to delete media');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Like or unlike a media item
   * @param {string} mediaId - The ID of the media item
   * @returns {Promise<Object>} - The updated media item
   */
  const likeMedia = useCallback(async (mediaId) => {
    setError(null);
    
    try {
      const response = await api.post(`/media/${mediaId}/like`);
      return response.data;
    } catch (err) {
      console.error('Error liking media:', err);
      setError(err.message || 'Failed to like media');
      throw err;
    }
  }, []);

  /**
   * Create a new album
   * @param {Object} albumData - The album data
   * @param {string} albumData.name - The album name
   * @param {string} albumData.description - Optional album description
   * @returns {Promise<Object>} - The created album
   */
  const createAlbum = useCallback(async (albumData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/albums', albumData);
      return response.data;
    } catch (err) {
      console.error('Error creating album:', err);
      setError(err.message || 'Failed to create album');
      
      // For demo purposes, return a mock album
      return {
        id: uuidv4(),
        name: albumData.name,
        description: albumData.description || '',
        coverImage: null,
        itemCount: 0,
        createdAt: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an album
   * @param {string} albumId - The ID of the album to update
   * @param {Object} albumData - The updated album data
   * @returns {Promise<Object>} - The updated album
   */
  const updateAlbum = useCallback(async (albumId, albumData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/albums/${albumId}`, albumData);
      return response.data;
    } catch (err) {
      console.error('Error updating album:', err);
      setError(err.message || 'Failed to update album');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete an album
   * @param {string} albumId - The ID of the album to delete
   * @returns {Promise<void>}
   */
  const deleteAlbum = useCallback(async (albumId) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/albums/${albumId}`);
    } catch (err) {
      console.error('Error deleting album:', err);
      setError(err.message || 'Failed to delete album');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a media item to an album
   * @param {string} mediaId - The ID of the media item
   * @param {string} albumId - The ID of the album
   * @returns {Promise<Object>} - The updated media item
   */
  const addToAlbum = useCallback(async (mediaId, albumId) => {
    setError(null);
    
    try {
      const response = await api.post(`/media/${mediaId}/album`, { albumId });
      return response.data;
    } catch (err) {
      console.error('Error adding to album:', err);
      setError(err.message || 'Failed to add to album');
      throw err;
    }
  }, []);

  /**
   * Remove a media item from an album
   * @param {string} mediaId - The ID of the media item
   * @returns {Promise<Object>} - The updated media item
   */
  const removeFromAlbum = useCallback(async (mediaId) => {
    setError(null);
    
    try {
      const response = await api.delete(`/media/${mediaId}/album`);
      return response.data;
    } catch (err) {
      console.error('Error removing from album:', err);
      setError(err.message || 'Failed to remove from album');
      throw err;
    }
  }, []);

  // Mock data functions for demo purposes
  const getMockMediaItems = (albumId = null) => {
    const allItems = [
      {
        id: '1',
        title: 'Family Picnic',
        description: 'Annual family picnic at the park',
        type: 'image',
        url: 'https://source.unsplash.com/random/800x600/?family,picnic',
        thumbnail: 'https://source.unsplash.com/random/800x600/?family,picnic',
        size: 1024000,
        albumId: '1',
        tags: ['family', 'picnic', 'summer'],
        isLiked: false,
        likeCount: 5,
        createdAt: '2023-06-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Birthday Celebration',
        description: 'Grandma\'s 80th birthday',
        type: 'image',
        url: 'https://source.unsplash.com/random/800x600/?birthday,elderly',
        thumbnail: 'https://source.unsplash.com/random/800x600/?birthday,elderly',
        size: 1548000,
        albumId: '1',
        tags: ['birthday', 'grandma', 'celebration'],
        isLiked: true,
        likeCount: 12,
        createdAt: '2023-05-22T14:45:00Z'
      },
      {
        id: '3',
        title: 'Wedding Day',
        description: 'John and Sarah\'s wedding',
        type: 'image',
        url: 'https://source.unsplash.com/random/800x600/?wedding',
        thumbnail: 'https://source.unsplash.com/random/800x600/?wedding',
        size: 2048000,
        albumId: '2',
        tags: ['wedding', 'ceremony', 'couple'],
        isLiked: false,
        likeCount: 8,
        createdAt: '2023-04-10T11:15:00Z'
      },
      {
        id: '4',
        title: 'Family Reunion',
        description: 'Summer family reunion at the lake house',
        type: 'video',
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnail: 'https://source.unsplash.com/random/800x600/?family,lake',
        size: 5120000,
        albumId: '2',
        tags: ['reunion', 'summer', 'lake'],
        isLiked: true,
        likeCount: 15,
        createdAt: '2023-07-05T16:20:00Z'
      },
      {
        id: '5',
        title: 'Graduation Day',
        description: 'Emily\'s college graduation',
        type: 'image',
        url: 'https://source.unsplash.com/random/800x600/?graduation',
        thumbnail: 'https://source.unsplash.com/random/800x600/?graduation',
        size: 1324000,
        albumId: '3',
        tags: ['graduation', 'college', 'achievement'],
        isLiked: false,
        likeCount: 7,
        createdAt: '2023-06-30T09:45:00Z'
      },
      {
        id: '6',
        title: 'New Baby',
        description: 'Welcome to the family, little one!',
        type: 'image',
        url: 'https://source.unsplash.com/random/800x600/?baby,newborn',
        thumbnail: 'https://source.unsplash.com/random/800x600/?baby,newborn',
        size: 984000,
        albumId: '3',
        tags: ['baby', 'newborn', 'family'],
        isLiked: true,
        likeCount: 20,
        createdAt: '2023-07-12T08:30:00Z'
      }
    ];
    
    if (albumId) {
      return allItems.filter(item => item.albumId === albumId);
    }
    
    return allItems;
  };

  const getMockAlbums = () => {
    return [
      {
        id: '1',
        name: 'Family Events',
        description: 'Special moments with the family',
        coverImage: 'https://source.unsplash.com/random/800x600/?family',
        itemCount: 2,
        createdAt: '2023-05-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Celebrations',
        description: 'Birthdays, weddings, and other celebrations',
        coverImage: 'https://source.unsplash.com/random/800x600/?celebration',
        itemCount: 2,
        createdAt: '2023-04-05T14:30:00Z'
      },
      {
        id: '3',
        name: 'Milestones',
        description: 'Important life milestones',
        coverImage: 'https://source.unsplash.com/random/800x600/?milestone',
        itemCount: 2,
        createdAt: '2023-06-20T09:15:00Z'
      }
    ];
  };

  return {
    getMediaItems,
    getAlbums,
    uploadMedia,
    deleteMedia,
    likeMedia,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addToAlbum,
    removeFromAlbum,
    error,
    loading
  };
};

export default useMedia; 