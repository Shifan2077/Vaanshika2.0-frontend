// File: src/pages/ChatPage.jsx
// Chat page for family communication

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaUsers, FaEllipsisV } from 'react-icons/fa';

// Components
import PageLayout from '../components/layout/PageLayout';
import ChatWindow from '../components/chat/ChatWindow';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Hooks
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    chatRooms, 
    currentRoom, 
    messages, 
    participants, 
    loading, 
    error,
    fetchChatRooms, 
    selectRoom, 
    sendMessage, 
    createChatRoom 
  } = useChat();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    description: '',
    type: 'family'
  });
  
  // Fetch chat rooms on component mount
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);
  
  // Select room when roomId changes
  useEffect(() => {
    if (roomId) {
      selectRoom(roomId);
    } else if (chatRooms.length > 0 && !currentRoom) {
      // Auto-select first room if none is selected
      navigate(`/chat/${chatRooms[0].id}`);
    }
  }, [roomId, chatRooms, currentRoom, selectRoom, navigate]);
  
  // Filter rooms based on search query
  const filteredRooms = chatRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle sending a message
  const handleSendMessage = async (text) => {
    if (currentRoom) {
      await sendMessage(currentRoom.id, text);
    }
  };
  
  // Handle creating a new room
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    if (!newRoomData.name) return;
    
    const room = await createChatRoom(newRoomData);
    setShowNewRoomModal(false);
    setNewRoomData({
      name: '',
      description: '',
      type: 'family'
    });
    
    if (room) {
      navigate(`/chat/${room.id}`);
    }
  };
  
  // Format date for last message
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  // Animated blob backgrounds
  const AnimatedBlobs = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.div 
        className="absolute top-20 left-10 w-96 h-96 bg-primary-300 opacity-10 rounded-full filter blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-40 right-20 w-96 h-96 bg-secondary-300 opacity-10 rounded-full filter blur-3xl"
        animate={{ 
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut"
        }}
      />
    </div>
  );
  
  return (
    <PageLayout
      title="Family Chat"
      subtitle="Stay connected with your family members"
      className="p-0 relative"
    >
      <AnimatedBlobs />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Chat rooms sidebar */}
        <div className="w-80 border-r border-neutral-200/30 dark:border-neutral-700/30 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm flex flex-col">
          {/* Search and new chat button */}
          <div className="p-4 border-b border-neutral-200/30 dark:border-neutral-700/30">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input-glass w-full pl-9 py-2"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              </div>
              <button
                onClick={() => setShowNewRoomModal(true)}
                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm"
                aria-label="Create new chat"
              >
                <FaPlus />
              </button>
            </div>
          </div>
          
          {/* Chat rooms list */}
          <div className="flex-1 overflow-y-auto">
            {loading.rooms ? (
              <div className="flex justify-center items-center h-32">
                <div className="loader"></div>
              </div>
            ) : error.rooms ? (
              <div className="p-4 text-center text-red-500">
                {error.rooms}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                {searchQuery ? 'No chats match your search' : 'No chats available'}
              </div>
            ) : (
              <ul>
                {filteredRooms.map(room => (
                  <li key={room.id}>
                    <button
                      onClick={() => navigate(`/chat/${room.id}`)}
                      className={`w-full text-left p-4 hover:bg-neutral-100/70 dark:hover:bg-neutral-700/70 transition-colors ${
                        currentRoom && currentRoom.id === room.id 
                          ? 'bg-neutral-100/80 dark:bg-neutral-700/80 border-l-4 border-primary-500' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {room.type === 'family' ? (
                            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 shadow-sm">
                              <FaUsers className="text-xl" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shadow-sm">
                              {room.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                              {room.name}
                            </h3>
                            {room.lastMessage && (
                              <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap ml-2">
                                {formatLastMessageTime(room.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                            {room.lastMessage ? (
                              <>
                                {room.lastMessage.senderId === currentUser?.uid ? 'You: ' : ''}
                                {room.lastMessage.text}
                              </>
                            ) : (
                              room.description || 'No messages yet'
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Chat window */}
        <div className="flex-1 flex flex-col bg-neutral-50/70 dark:bg-neutral-900/70 backdrop-blur-sm">
          {!currentRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-neutral-500 dark:text-neutral-400">
              <div className="card-glass p-8 max-w-md text-center">
                <FaUsers className="text-5xl mb-4 mx-auto text-primary-500" />
                <h2 className="text-xl font-medium mb-2">Select a chat to start messaging</h2>
                <p className="text-center">
                  Choose an existing conversation from the sidebar or create a new chat to connect with your family members.
                </p>
                <button
                  onClick={() => setShowNewRoomModal(true)}
                  className="btn-primary mt-6"
                >
                  Create New Chat
                </button>
              </div>
            </div>
          ) : (
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={loading.messages}
              participants={participants}
            />
          )}
        </div>
      </div>
      
      {/* New chat room modal */}
      {showNewRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass max-w-md w-full mx-4 shadow-glass"
          >
            <div className="p-4 border-b border-neutral-200/30 dark:border-neutral-700/30 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Create New Chat</h2>
              <button
                onClick={() => setShowNewRoomModal(false)}
                className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateRoom} className="p-4">
              <div className="mb-4">
                <label htmlFor="roomName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Chat Name*
                </label>
                <input
                  id="roomName"
                  type="text"
                  value={newRoomData.name}
                  onChange={(e) => setNewRoomData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input-glass w-full"
                  placeholder="e.g., Family General, Event Planning"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="roomDescription" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  id="roomDescription"
                  value={newRoomData.description}
                  onChange={(e) => setNewRoomData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input-glass w-full"
                  placeholder="What is this chat about?"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="roomType" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Type
                </label>
                <select
                  id="roomType"
                  value={newRoomData.type}
                  onChange={(e) => setNewRoomData(prev => ({ ...prev, type: e.target.value }))}
                  className="form-input-glass w-full"
                >
                  <option value="family">Family Group</option>
                  <option value="group">Custom Group</option>
                  <option value="direct">Direct Message</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewRoomModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!newRoomData.name.trim() || loading.rooms}
                >
                  {loading.rooms ? 'Creating...' : 'Create Chat'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </PageLayout>
  );
};

export default ChatPage; 