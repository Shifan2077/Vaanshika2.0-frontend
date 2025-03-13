// File: src/pages/ProfilePage.jsx
// Modern profile page with glassmorphic effects and tabs for different sections

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaLock, FaHistory, FaBell, FaCamera, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, updateProfile, updateEmail, updatePassword, reauthenticate } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    location: '',
    birthDate: '',
    profileImage: null,
    profileImageUrl: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        location: user.location || '',
        birthDate: user.birthDate || '',
        profileImage: null,
        profileImageUrl: user.photoURL || ''
      });
      
      // Load activities and notifications (mock data for now)
      // In a real app, these would come from your backend
      setActivities([
        { id: 1, action: 'Updated profile picture', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 2, action: 'Added new family member', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 3, action: 'Created new event', timestamp: new Date(Date.now() - 86400000 * 7).toISOString() }
      ]);
      
      setNotifications([
        { id: 1, message: 'John Doe commented on your photo', read: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, message: 'Upcoming birthday: Jane Doe', read: true, timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, message: 'New family event created', read: true, timestamp: new Date(Date.now() - 86400000 * 3).toISOString() }
      ]);
    }
  }, [user]);
  
  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profileImage: file,
        profileImageUrl: URL.createObjectURL(file)
      });
    }
  };
  
  // Handle profile form input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  // Handle password form input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Save profile changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Update profile data
      await updateProfile({
        displayName: profileData.displayName,
        photoURL: profileData.profileImageUrl,
        phoneNumber: profileData.phoneNumber,
        bio: profileData.bio,
        location: profileData.location,
        birthDate: profileData.birthDate
      });
      
      // Update email if changed
      if (profileData.email !== user.email) {
        await updateEmail(profileData.email);
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      setIsLoading(false);
      return;
    }
    
    try {
      // Reauthenticate user first
      await reauthenticate(passwordData.currentPassword);
      
      // Update password
      await updatePassword(passwordData.newPassword);
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get time ago string
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffTime = Math.abs(now - activityDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glassmorphism bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Profile header */}
          <div className="relative h-48 bg-gradient-to-r from-primary-600 to-secondary-600">
            <div className="absolute -bottom-16 left-8 sm:left-12">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  {profileData.profileImageUrl ? (
                    <img
                      src={profileData.profileImageUrl}
                      alt={profileData.displayName || 'User'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-4xl">
                        {profileData.displayName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                    <FaCamera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-opacity-30 transition-colors"
              >
                <FaPencilAlt className="h-4 w-4" />
              </button>
            )}
            
            {isEditing && (
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={handleProfileSubmit}
                  disabled={isLoading}
                  className="bg-success bg-opacity-80 backdrop-blur-sm rounded-full p-2 text-white hover:bg-opacity-100 transition-colors"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaCheck className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-error bg-opacity-80 backdrop-blur-sm rounded-full p-2 text-white hover:bg-opacity-100 transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Profile name and tabs */}
          <div className="pt-20 px-8 sm:px-12">
            <h1 className="text-2xl font-bold text-neutral-900">
              {profileData.displayName || 'User Profile'}
            </h1>
            
            {message.text && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-success-light text-success-dark' 
                  : 'bg-error-light text-error'
              }`}>
                {message.text}
              </div>
            )}
            
            <div className="mt-6 border-b border-neutral-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2 h-4 w-4" />
                    Profile
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'security'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center">
                    <FaLock className="mr-2 h-4 w-4" />
                    Security
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center">
                    <FaHistory className="mr-2 h-4 w-4" />
                    Activity
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'notifications'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center">
                    <FaBell className="mr-2 h-4 w-4" />
                    Notifications
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </div>
                </button>
              </nav>
            </div>
            
            {/* Tab content */}
            <div className="py-8">
              {/* Profile tab */}
              {activeTab === 'profile' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="displayName"
                          name="displayName"
                          value={profileData.displayName}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="form-input w-full rounded-lg"
                          placeholder="Your full name"
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="form-input w-full rounded-lg"
                          placeholder="your.email@example.com"
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="form-input w-full rounded-lg"
                          placeholder="+1 (555) 123-4567"
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-neutral-700 mb-1">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={profileData.birthDate}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="form-input w-full rounded-lg"
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="form-input w-full rounded-lg"
                          placeholder="City, Country"
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows="4"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="form-textarea w-full rounded-lg"
                          placeholder="Tell us about yourself..."
                        ></textarea>
                      </motion.div>
                    </div>
                    
                    {isEditing && (
                      <motion.div variants={itemVariants} className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </motion.div>
                    )}
                  </form>
                </motion.div>
              )}
              
              {/* Security tab */}
              {activeTab === 'security' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h3 variants={itemVariants} className="text-lg font-medium text-neutral-900 mb-6">
                    Change Password
                  </motion.h3>
                  
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-6">
                      <motion.div variants={itemVariants}>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="form-input w-full rounded-lg"
                          placeholder="••••••••"
                          required
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="form-input w-full rounded-lg"
                          placeholder="••••••••"
                          required
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                          Password must be at least 8 characters long
                        </p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="form-input w-full rounded-lg"
                          placeholder="••••••••"
                          required
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </button>
                      </motion.div>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {/* Activity tab */}
              {activeTab === 'activity' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h3 variants={itemVariants} className="text-lg font-medium text-neutral-900 mb-6">
                    Recent Activity
                  </motion.h3>
                  
                  {activities.length > 0 ? (
                    <ul className="space-y-4">
                      {activities.map((activity) => (
                        <motion.li
                          key={activity.id}
                          variants={itemVariants}
                          className="glassmorphism bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-4"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <FaHistory className="h-5 w-5 text-primary-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-neutral-900">
                                You {activity.action}
                              </p>
                              <p className="mt-1 text-xs text-neutral-500">
                                {formatDate(activity.timestamp)} ({getTimeAgo(activity.timestamp)})
                              </p>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <motion.p variants={itemVariants} className="text-neutral-500 text-center py-8">
                      No recent activity
                    </motion.p>
                  )}
                </motion.div>
              )}
              
              {/* Notifications tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-neutral-900">
                      Notifications
                    </h3>
                    
                    <button
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Mark all as read
                    </button>
                  </motion.div>
                  
                  {notifications.length > 0 ? (
                    <ul className="space-y-4">
                      {notifications.map((notification) => (
                        <motion.li
                          key={notification.id}
                          variants={itemVariants}
                          className={`glassmorphism backdrop-blur-sm rounded-lg p-4 ${
                            notification.read
                              ? 'bg-white bg-opacity-50'
                              : 'bg-primary-50 bg-opacity-70 border-l-4 border-primary-600'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                notification.read
                                  ? 'bg-neutral-100'
                                  : 'bg-primary-100'
                              }`}>
                                <FaBell className={`h-5 w-5 ${
                                  notification.read
                                    ? 'text-neutral-600'
                                    : 'text-primary-600'
                                }`} />
                              </div>
                            </div>
                            <div className="ml-3 flex-1">
                              <p className={`text-sm ${
                                notification.read
                                  ? 'text-neutral-700'
                                  : 'text-neutral-900 font-medium'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="mt-1 text-xs text-neutral-500">
                                {getTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <button className="ml-2 text-primary-600 hover:text-primary-700">
                                <span className="sr-only">Mark as read</span>
                                <FaCheck className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <motion.p variants={itemVariants} className="text-neutral-500 text-center py-8">
                      No notifications
                    </motion.p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage; 