// File: src/pages/MediaGalleryPage.jsx
// Modern media gallery page with glassmorphic effects and masonry layout

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useMedia } from '../hooks/useMedia';
import { 
  FaImage, 
  FaVideo, 
  FaUpload, 
  FaFolder, 
  FaEllipsisH, 
  FaDownload, 
  FaTrash, 
  FaShare, 
  FaHeart, 
  FaRegHeart,
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const MediaGalleryPage = () => {
  const { user } = useAuth();
  const { 
    getMediaItems, 
    getAlbums, 
    uploadMedia, 
    deleteMedia, 
    likeMedia, 
    createAlbum 
  } = useMedia();
  
  const [mediaItems, setMediaItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  
  const fileInputRef = useRef(null);
  
  // Load media items and albums
  useEffect(() => {
    const loadMediaData = async () => {
      try {
        setIsLoading(true);
        
        // Get albums
        const albumsData = await getAlbums();
        setAlbums(albumsData);
        
        // Get media items (either for selected album or all)
        const mediaData = await getMediaItems(selectedAlbum?.id);
        setMediaItems(mediaData);
      } catch (error) {
        console.error('Error loading media data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMediaData();
  }, [getMediaItems, getAlbums, selectedAlbum]);
  
  // Filter media items based on search query
  const filteredMediaItems = mediaItems.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update progress
        const progressPerFile = 100 / files.length;
        const currentProgress = i * progressPerFile;
        setUploadProgress(currentProgress);
        
        // Upload file
        await uploadMedia(file, {
          albumId: selectedAlbum?.id,
          onProgress: (progress) => {
            const fileProgress = progress * progressPerFile / 100;
            setUploadProgress(currentProgress + fileProgress);
          }
        });
      }
      
      // Refresh media items
      const mediaData = await getMediaItems(selectedAlbum?.id);
      setMediaItems(mediaData);
      
      setUploadProgress(100);
      
      // Reset after a delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error uploading files:', error);
      setIsUploading(false);
    }
  };
  
  // Handle media selection
  const handleMediaClick = (media) => {
    setSelectedMedia(media);
  };
  
  // Handle media like
  const handleLikeMedia = async (mediaId) => {
    try {
      await likeMedia(mediaId);
      
      // Update media item in state
      setMediaItems(prevItems => 
        prevItems.map(item => 
          item.id === mediaId 
            ? { 
                ...item, 
                isLiked: !item.isLiked,
                likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1
              } 
            : item
        )
      );
      
      // Update selected media if it's the one being liked
      if (selectedMedia?.id === mediaId) {
        setSelectedMedia(prev => ({
          ...prev,
          isLiked: !prev.isLiked,
          likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
        }));
      }
    } catch (error) {
      console.error('Error liking media:', error);
    }
  };
  
  // Handle media deletion
  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteMedia(mediaId);
      
      // Remove from state
      setMediaItems(prevItems => prevItems.filter(item => item.id !== mediaId));
      
      // Close lightbox if the deleted item was selected
      if (selectedMedia?.id === mediaId) {
        setSelectedMedia(null);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };
  
  // Handle album creation
  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;
    
    try {
      const newAlbum = await createAlbum({ name: newAlbumName });
      setAlbums(prev => [...prev, newAlbum]);
      setNewAlbumName('');
      setShowCreateAlbumModal(false);
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };
  
  // Navigate through media in lightbox
  const navigateMedia = (direction) => {
    if (!selectedMedia) return;
    
    const currentIndex = filteredMediaItems.findIndex(item => item.id === selectedMedia.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredMediaItems.length;
    } else {
      newIndex = (currentIndex - 1 + filteredMediaItems.length) % filteredMediaItems.length;
    }
    
    setSelectedMedia(filteredMediaItems[newIndex]);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {selectedAlbum ? selectedAlbum.name : 'Media Gallery'}
            </h1>
            <p className="mt-1 text-neutral-600">
              {selectedAlbum 
                ? `${filteredMediaItems.length} items in this album` 
                : `${filteredMediaItems.length} total items`}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <FaUpload className="mr-2" />
              Upload
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
            
            <button
              onClick={() => setShowCreateAlbumModal(true)}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <FaFolder className="mr-2" />
              New Album
            </button>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media..."
                className="form-input pl-10 py-2 pr-4 block w-full sm:text-sm border-neutral-300 rounded-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaTimes className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Upload progress */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-700">Uploading...</span>
              <span className="text-sm font-medium text-neutral-700">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Albums row */}
        {albums.length > 0 && (
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedAlbum(null)}
                className={`flex-shrink-0 glassmorphism ${
                  !selectedAlbum 
                    ? 'bg-primary-100 bg-opacity-70 border-2 border-primary-600' 
                    : 'bg-white bg-opacity-70 hover:bg-opacity-80'
                } backdrop-blur-sm rounded-xl p-4 transition-all`}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-primary-50 rounded-lg mb-2">
                  <FaImage className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-sm font-medium text-center text-neutral-900">All Media</p>
                <p className="text-xs text-center text-neutral-500">{mediaItems.length} items</p>
              </button>
              
              {albums.map(album => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className={`flex-shrink-0 glassmorphism ${
                    selectedAlbum?.id === album.id 
                      ? 'bg-primary-100 bg-opacity-70 border-2 border-primary-600' 
                      : 'bg-white bg-opacity-70 hover:bg-opacity-80'
                  } backdrop-blur-sm rounded-xl p-4 transition-all`}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-50 rounded-lg mb-2">
                    {album.coverImage ? (
                      <img 
                        src={album.coverImage} 
                        alt={album.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FaFolder className="h-8 w-8 text-primary-600" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-center text-neutral-900">{album.name}</p>
                  <p className="text-xs text-center text-neutral-500">{album.itemCount || 0} items</p>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* View mode toggle */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-lg shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'masonry'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Masonry
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredMediaItems.length === 0 ? (
          <div className="glassmorphism bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-md p-12 text-center">
            <FaImage className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No media items found</h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery 
                ? 'Try a different search term or clear your search'
                : selectedAlbum 
                  ? 'This album is empty. Upload some photos or videos to get started!'
                  : 'Upload some photos or videos to get started!'}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <FaUpload className="mr-2" />
              Upload Media
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'
            }
          >
            {filteredMediaItems.map(media => (
              <motion.div
                key={media.id}
                variants={itemVariants}
                className={`glassmorphism bg-white bg-opacity-70 backdrop-blur-lg rounded-xl overflow-hidden shadow-md ${
                  viewMode === 'masonry' ? 'mb-4 break-inside-avoid' : ''
                }`}
                onClick={() => handleMediaClick(media)}
              >
                <div className="relative group cursor-pointer">
                  {media.type === 'video' ? (
                    <div className="aspect-w-16 aspect-h-9">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        poster={media.thumbnail}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <FaVideo className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={media.url}
                      alt={media.title || 'Media item'}
                      className="w-full h-auto object-cover"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeMedia(media.id);
                      }}
                      className="bg-white rounded-full p-2 mx-1 hover:bg-neutral-100 transition-colors"
                    >
                      {media.isLiked ? (
                        <FaHeart className="h-4 w-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="h-4 w-4 text-neutral-700" />
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download
                        window.open(media.url, '_blank');
                      }}
                      className="bg-white rounded-full p-2 mx-1 hover:bg-neutral-100 transition-colors"
                    >
                      <FaDownload className="h-4 w-4 text-neutral-700" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMedia(media.id);
                      }}
                      className="bg-white rounded-full p-2 mx-1 hover:bg-neutral-100 transition-colors"
                    >
                      <FaTrash className="h-4 w-4 text-neutral-700" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900 truncate">
                        {media.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {formatDate(media.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      {media.likeCount > 0 && (
                        <div className="flex items-center mr-2">
                          <FaHeart className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-xs text-neutral-500">{media.likeCount}</span>
                        </div>
                      )}
                      
                      <button className="text-neutral-400 hover:text-neutral-600">
                        <FaEllipsisH className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Media lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors"
              onClick={() => setSelectedMedia(null)}
            >
              <FaTimes className="h-6 w-6" />
            </button>
            
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-opacity-30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateMedia('prev');
              }}
            >
              <FaChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-opacity-30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateMedia('next');
              }}
            >
              <FaChevronRight className="h-6 w-6" />
            </button>
            
            <div
              className="max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-lg"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title || 'Media item'}
                  className="max-w-full max-h-[80vh] rounded-lg"
                />
              )}
              
              <div className="glassmorphism bg-white bg-opacity-70 backdrop-blur-lg rounded-xl mt-4 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">
                      {selectedMedia.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {formatDate(selectedMedia.createdAt)}
                    </p>
                    {selectedMedia.description && (
                      <p className="mt-2 text-sm text-neutral-700">
                        {selectedMedia.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLikeMedia(selectedMedia.id)}
                      className="flex items-center px-3 py-1 rounded-full bg-white shadow-sm hover:bg-neutral-50 transition-colors"
                    >
                      {selectedMedia.isLiked ? (
                        <FaHeart className="h-4 w-4 text-red-500 mr-1" />
                      ) : (
                        <FaRegHeart className="h-4 w-4 text-neutral-700 mr-1" />
                      )}
                      <span className="text-sm">
                        {selectedMedia.likeCount || 0}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => window.open(selectedMedia.url, '_blank')}
                      className="flex items-center px-3 py-1 rounded-full bg-white shadow-sm hover:bg-neutral-50 transition-colors"
                    >
                      <FaDownload className="h-4 w-4 text-neutral-700 mr-1" />
                      <span className="text-sm">Download</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteMedia(selectedMedia.id)}
                      className="flex items-center px-3 py-1 rounded-full bg-white shadow-sm hover:bg-neutral-50 transition-colors"
                    >
                      <FaTrash className="h-4 w-4 text-neutral-700 mr-1" />
                      <span className="text-sm">Delete</span>
                    </button>
                    
                    <button
                      className="flex items-center px-3 py-1 rounded-full bg-white shadow-sm hover:bg-neutral-50 transition-colors"
                    >
                      <FaShare className="h-4 w-4 text-neutral-700 mr-1" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Create album modal */}
      <AnimatePresence>
        {showCreateAlbumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateAlbumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glassmorphism bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Create New Album</h3>
              
              <div className="mb-4">
                <label htmlFor="albumName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Album Name
                </label>
                <input
                  type="text"
                  id="albumName"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="form-input w-full rounded-lg"
                  placeholder="Enter album name"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCreateAlbumModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAlbum}
                  disabled={!newAlbumName.trim()}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Album
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaGalleryPage; 