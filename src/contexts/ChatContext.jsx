// File: src/contexts/ChatContext.jsx
// Context for managing chat functionality

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

// Create context
const ChatContext = createContext();

// Socket instance
let socket;

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState({
    rooms: false,
    messages: false,
    sending: false
  });
  const [error, setError] = useState({
    rooms: null,
    messages: null,
    sending: null
  });

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      // Connect to socket server
      socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000', {
        query: { userId: user.uid }
      });

      // Socket event listeners
      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on('error', (err) => {
        console.error('Socket error:', err);
      });

      socket.on('new_message', (message) => {
        if (currentRoom && message.roomId === currentRoom.id) {
          setMessages(prev => [...prev, message]);
        }
      });

      // Clean up on unmount
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [user, currentRoom]);

  // Fetch chat rooms
  const fetchChatRooms = useCallback(async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, rooms: true }));
    setError(prev => ({ ...prev, rooms: null }));

    try {
      const response = await api.get('/chat/rooms');
      
      // For demo purposes, if the API doesn't return data yet, return mock data
      if (!response.data || response.data.length === 0) {
        const mockRooms = getMockChatRooms();
        setChatRooms(mockRooms);
        return mockRooms;
      }
      
      setChatRooms(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching chat rooms:', err);
      setError(prev => ({ 
        ...prev, 
        rooms: err.message || 'Failed to fetch chat rooms' 
      }));
      
      // Return mock data for demo purposes
      const mockRooms = getMockChatRooms();
      setChatRooms(mockRooms);
      return mockRooms;
    } finally {
      setLoading(prev => ({ ...prev, rooms: false }));
    }
  }, [user]);

  // Fetch messages for a room
  const fetchMessages = useCallback(async (roomId) => {
    if (!user || !roomId) return;

    setLoading(prev => ({ ...prev, messages: true }));
    setError(prev => ({ ...prev, messages: null }));

    try {
      const response = await api.get(`/chat/rooms/${roomId}/messages`);
      
      // For demo purposes, if the API doesn't return data yet, return mock data
      if (!response.data || response.data.length === 0) {
        const mockMessages = getMockMessages(roomId);
        setMessages(mockMessages);
        return mockMessages;
      }
      
      setMessages(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(prev => ({ 
        ...prev, 
        messages: err.message || 'Failed to fetch messages' 
      }));
      
      // Return mock data for demo purposes
      const mockMessages = getMockMessages(roomId);
      setMessages(mockMessages);
      return mockMessages;
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  }, [user]);

  // Fetch participants for a room
  const fetchParticipants = useCallback(async (roomId) => {
    if (!user || !roomId) return;

    try {
      const response = await api.get(`/chat/rooms/${roomId}/participants`);
      
      // For demo purposes, if the API doesn't return data yet, return mock data
      if (!response.data || response.data.length === 0) {
        const mockParticipants = getMockParticipants();
        setParticipants(mockParticipants);
        return mockParticipants;
      }
      
      setParticipants(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching participants:', err);
      
      // Return mock data for demo purposes
      const mockParticipants = getMockParticipants();
      setParticipants(mockParticipants);
      return mockParticipants;
    }
  }, [user]);

  // Select a chat room
  const selectRoom = useCallback(async (roomId) => {
    if (!user || !roomId) return;

    // Find room in existing rooms
    const room = chatRooms.find(r => r.id === roomId);
    
    if (room) {
      setCurrentRoom(room);
      
      // Join socket room
      if (socket) {
        socket.emit('join_room', roomId);
      }
      
      // Fetch messages and participants
      await Promise.all([
        fetchMessages(roomId),
        fetchParticipants(roomId)
      ]);
    }
  }, [user, chatRooms, fetchMessages, fetchParticipants]);

  // Send a message
  const sendMessage = useCallback(async (roomId, text) => {
    if (!user || !roomId || !text.trim()) return;

    setLoading(prev => ({ ...prev, sending: true }));
    setError(prev => ({ ...prev, sending: null }));

    try {
      // Create message object
      const messageData = {
        text,
        roomId,
        senderId: user.uid,
        timestamp: new Date().toISOString()
      };
      
      // Send to API
      const response = await api.post(`/chat/rooms/${roomId}/messages`, messageData);
      
      // For demo purposes, if the API doesn't return data yet, use the message data
      const newMessage = response.data || {
        ...messageData,
        id: uuidv4()
      };
      
      // Add to messages
      setMessages(prev => [...prev, newMessage]);
      
      // Emit socket event
      if (socket) {
        socket.emit('send_message', newMessage);
      }
      
      return newMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(prev => ({ 
        ...prev, 
        sending: err.message || 'Failed to send message' 
      }));
      
      // For demo purposes, still add the message to the UI
      const newMessage = {
        id: uuidv4(),
        text,
        roomId,
        senderId: user.uid,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  }, [user]);

  // Create a new chat room
  const createChatRoom = useCallback(async (roomData) => {
    if (!user) return;

    setLoading(prev => ({ ...prev, rooms: true }));
    setError(prev => ({ ...prev, rooms: null }));

    try {
      const response = await api.post('/chat/rooms', roomData);
      
      // For demo purposes, if the API doesn't return data yet, create a mock room
      const newRoom = response.data || {
        id: uuidv4(),
        ...roomData,
        createdAt: new Date().toISOString(),
        createdBy: user.uid
      };
      
      setChatRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      console.error('Error creating chat room:', err);
      setError(prev => ({ 
        ...prev, 
        rooms: err.message || 'Failed to create chat room' 
      }));
      
      // For demo purposes, still create a mock room
      const newRoom = {
        id: uuidv4(),
        ...roomData,
        createdAt: new Date().toISOString(),
        createdBy: user.uid
      };
      
      setChatRooms(prev => [...prev, newRoom]);
      return newRoom;
    } finally {
      setLoading(prev => ({ ...prev, rooms: false }));
    }
  }, [user]);

  // Mock data functions for demo purposes
  const getMockChatRooms = () => {
    return [
      {
        id: '1',
        name: 'Family General',
        description: 'General chat for all family members',
        type: 'family',
        createdAt: '2023-06-01T10:00:00Z',
        createdBy: 'user1',
        lastMessage: {
          text: 'Looking forward to seeing everyone at the reunion!',
          timestamp: '2023-07-15T14:30:00Z',
          senderId: 'user2'
        }
      },
      {
        id: '2',
        name: 'Event Planning',
        description: 'Discuss upcoming family events',
        type: 'family',
        createdAt: '2023-06-10T15:20:00Z',
        createdBy: 'user3',
        lastMessage: {
          text: 'Should we book the venue for July or August?',
          timestamp: '2023-07-14T09:45:00Z',
          senderId: 'user1'
        }
      },
      {
        id: '3',
        name: 'Recipes & Cooking',
        description: 'Share family recipes and cooking tips',
        type: 'family',
        createdAt: '2023-06-15T11:30:00Z',
        createdBy: 'user4',
        lastMessage: {
          text: 'I found grandma\'s secret apple pie recipe!',
          timestamp: '2023-07-13T16:20:00Z',
          senderId: 'user4'
        }
      }
    ];
  };

  const getMockMessages = (roomId) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const baseMessages = [
      {
        id: '1',
        roomId: '1',
        senderId: 'user2',
        text: 'Hello everyone! How are you all doing?',
        timestamp: twoDaysAgo.toISOString()
      },
      {
        id: '2',
        roomId: '1',
        senderId: 'user1',
        text: 'Doing great! Working on some home renovations this weekend.',
        timestamp: twoDaysAgo.toISOString()
      },
      {
        id: '3',
        roomId: '1',
        senderId: 'user3',
        text: 'I\'m good too. Just got back from a business trip.',
        timestamp: yesterday.toISOString()
      },
      {
        id: '4',
        roomId: '1',
        senderId: 'user4',
        text: 'Has anyone heard from Grandma lately?',
        timestamp: yesterday.toISOString()
      },
      {
        id: '5',
        roomId: '1',
        senderId: 'user1',
        text: 'I called her yesterday. She\'s doing well and sends her love to everyone.',
        timestamp: yesterday.toISOString()
      },
      {
        id: '6',
        roomId: '1',
        senderId: 'user2',
        text: 'Looking forward to seeing everyone at the reunion!',
        timestamp: now.toISOString()
      },
      {
        id: '7',
        roomId: '2',
        senderId: 'user3',
        text: 'I was thinking we should start planning the annual family reunion.',
        timestamp: twoDaysAgo.toISOString()
      },
      {
        id: '8',
        roomId: '2',
        senderId: 'user4',
        text: 'Great idea! When were you thinking?',
        timestamp: twoDaysAgo.toISOString()
      },
      {
        id: '9',
        roomId: '2',
        senderId: 'user3',
        text: 'Maybe late July or early August? The weather should be nice then.',
        timestamp: yesterday.toISOString()
      },
      {
        id: '10',
        roomId: '2',
        senderId: 'user1',
        text: 'Should we book the venue for July or August?',
        timestamp: now.toISOString()
      },
      {
        id: '11',
        roomId: '3',
        senderId: 'user4',
        text: 'Does anyone have mom\'s lasagna recipe?',
        timestamp: twoDaysAgo.toISOString()
      },
      {
        id: '12',
        roomId: '3',
        senderId: 'user2',
        text: 'I think I have it somewhere. Let me check.',
        timestamp: twoDaysAgo.toISOString()
      },
      {
        id: '13',
        roomId: '3',
        senderId: 'user2',
        text: 'Found it! I\'ll send it to you later today.',
        timestamp: yesterday.toISOString()
      },
      {
        id: '14',
        roomId: '3',
        senderId: 'user4',
        text: 'I found grandma\'s secret apple pie recipe!',
        timestamp: now.toISOString()
      }
    ];
    
    // Filter messages for the specified room
    return baseMessages.filter(message => message.roomId === roomId);
  };

  const getMockParticipants = () => {
    return [
      {
        id: 'user1',
        name: 'John Doe',
        avatar: null,
        online: true
      },
      {
        id: 'user2',
        name: 'Jane Smith',
        avatar: null,
        online: true
      },
      {
        id: 'user3',
        name: 'Michael Johnson',
        avatar: null,
        online: false
      },
      {
        id: 'user4',
        name: 'Sarah Williams',
        avatar: null,
        online: true
      }
    ];
  };

  // Context value
  const value = {
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
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};

export default ChatContext; 