// File: src/services/chatService.js
// Service for handling chat-related API calls

import api from './api';

/**
 * Service for handling chat-related operations
 */
const chatService = {
  /**
   * Get all chat rooms for the current user
   * @returns {Promise<Array>} List of chat rooms
   */
  getChatRooms: async () => {
    try {
      const response = await api.get('/chat/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  },

  /**
   * Get a specific chat room by ID
   * @param {string} roomId - The ID of the chat room
   * @returns {Promise<Object>} Chat room details
   */
  getChatRoomById: async (roomId) => {
    try {
      const response = await api.get(`/chat/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chat room ${roomId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new chat room
   * @param {Object} roomData - The chat room data
   * @returns {Promise<Object>} Created chat room
   */
  createChatRoom: async (roomData) => {
    try {
      const response = await api.post('/chat/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  /**
   * Get messages for a specific chat room
   * @param {string} roomId - The ID of the chat room
   * @param {Object} options - Options for pagination
   * @param {number} options.limit - Number of messages to fetch
   * @param {string} options.before - Fetch messages before this message ID
   * @returns {Promise<Array>} List of messages
   */
  getMessages: async (roomId, options = {}) => {
    try {
      const response = await api.get(`/chat/rooms/${roomId}/messages`, { params: options });
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for room ${roomId}:`, error);
      throw error;
    }
  },

  /**
   * Send a message to a chat room
   * @param {string} roomId - The ID of the chat room
   * @param {Object} messageData - The message data
   * @returns {Promise<Object>} Sent message
   */
  sendMessage: async (roomId, messageData) => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/messages`, messageData);
      return response.data;
    } catch (error) {
      console.error(`Error sending message to room ${roomId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a message
   * @param {string} roomId - The ID of the chat room
   * @param {string} messageId - The ID of the message to delete
   * @returns {Promise<Object>} Response data
   */
  deleteMessage: async (roomId, messageId) => {
    try {
      const response = await api.delete(`/chat/rooms/${roomId}/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting message ${messageId}:`, error);
      throw error;
    }
  },

  /**
   * Edit a message
   * @param {string} roomId - The ID of the chat room
   * @param {string} messageId - The ID of the message to edit
   * @param {Object} messageData - The updated message data
   * @returns {Promise<Object>} Updated message
   */
  editMessage: async (roomId, messageId, messageData) => {
    try {
      const response = await api.put(`/chat/rooms/${roomId}/messages/${messageId}`, messageData);
      return response.data;
    } catch (error) {
      console.error(`Error editing message ${messageId}:`, error);
      throw error;
    }
  },

  /**
   * Get participants of a chat room
   * @param {string} roomId - The ID of the chat room
   * @returns {Promise<Array>} List of participants
   */
  getRoomParticipants: async (roomId) => {
    try {
      const response = await api.get(`/chat/rooms/${roomId}/participants`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching participants for room ${roomId}:`, error);
      throw error;
    }
  },

  /**
   * Add a participant to a chat room
   * @param {string} roomId - The ID of the chat room
   * @param {string} userId - The ID of the user to add
   * @returns {Promise<Object>} Response data
   */
  addParticipant: async (roomId, userId) => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/participants`, { userId });
      return response.data;
    } catch (error) {
      console.error(`Error adding participant to room ${roomId}:`, error);
      throw error;
    }
  },

  /**
   * Remove a participant from a chat room
   * @param {string} roomId - The ID of the chat room
   * @param {string} userId - The ID of the user to remove
   * @returns {Promise<Object>} Response data
   */
  removeParticipant: async (roomId, userId) => {
    try {
      const response = await api.delete(`/chat/rooms/${roomId}/participants/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing participant from room ${roomId}:`, error);
      throw error;
    }
  }
};

export default chatService; 