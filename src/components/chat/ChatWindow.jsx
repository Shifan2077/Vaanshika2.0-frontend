// File: src/components/chat/ChatWindow.jsx
// Component for displaying chat messages and sending new messages

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSmile, FaPaperclip, FaImage } from 'react-icons/fa';

const ChatWindow = ({ messages, onSendMessage, isLoading, participants }) => {
  const { currentUser } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    onSendMessage(messageText);
    setMessageText('');
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for message groups
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise, return formatted date
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup
          });
        }
        
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup
      });
    }
    
    return groups;
  };
  
  // Get user name from participants
  const getUserName = (userId) => {
    const participant = participants.find(p => p.id === userId);
    return participant ? participant.name : 'Unknown User';
  };
  
  // Check if message is from current user
  const isCurrentUser = (userId) => {
    return userId === currentUser?.uid;
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // TODO: Implement file upload functionality
    console.log('File selected:', file);
    
    // Reset file input
    e.target.value = null;
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  // Message groups
  const messageGroups = groupMessagesByDate();
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center">
        <div className="flex-1">
          <h2 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
            {participants.length > 0 ? (
              <>
                {participants.length <= 3 ? (
                  participants.map(p => p.name).join(', ')
                ) : (
                  `${participants[0].name} and ${participants.length - 1} others`
                )}
              </>
            ) : (
              'Chat'
            )}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {participants.length} participants
          </p>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-900">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm mt-2">Be the first to send a message!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <div className="flex justify-center">
                  <div className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 rounded-full text-xs text-neutral-600 dark:text-neutral-300">
                    {formatDate(new Date(group.date))}
                  </div>
                </div>
                
                {group.messages.map((message, messageIndex) => {
                  const isUser = isCurrentUser(message.senderId);
                  const showSender = messageIndex === 0 || 
                    group.messages[messageIndex - 1].senderId !== message.senderId;
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
                        {!isUser && showSender && (
                          <div className="ml-2 mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            {getUserName(message.senderId)}
                          </div>
                        )}
                        
                        <div className={`rounded-2xl px-4 py-2 ${
                          isUser 
                            ? 'bg-primary-600 text-white rounded-tr-none' 
                            : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-none shadow-sm'
                        }`}>
                          {message.text}
                          
                          {message.image && (
                            <img 
                              src={message.image} 
                              alt="Shared" 
                              className="mt-2 rounded-lg max-h-60 w-auto object-contain"
                            />
                          )}
                          
                          <div className={`text-xs mt-1 text-right ${
                            isUser ? 'text-primary-100' : 'text-neutral-500 dark:text-neutral-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="form-input w-full py-2 pr-10 resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                <FaSmile />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                <FaPaperclip />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-2 z-10">
                <div className="grid grid-cols-8 gap-1">
                  {['😊', '😂', '❤️', '👍', '🎉', '🙏', '😍', '🤔', '😢', '😎', '🥳', '😇', '🤗', '🤣', '😘', '😁'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className="w-8 h-8 text-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!messageText.trim() || isLoading}
            className={`p-3 rounded-full ${
              messageText.trim() && !isLoading
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      senderId: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      image: PropTypes.string
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

ChatWindow.defaultProps = {
  messages: [],
  isLoading: false,
  participants: []
};

export default ChatWindow; 