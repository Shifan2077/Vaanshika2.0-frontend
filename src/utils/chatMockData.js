// File: src/utils/chatMockData.js
// Mock data for chat functionality that aligns with planned API structure

import { v4 as uuidv4 } from 'uuid';

// Current user for testing
export const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
  email: 'john.doe@example.com'
};

// Chat groups
export const chatGroups = [
  {
    id: 'group-1',
    name: 'Family Group',
    description: 'Main family discussion group',
    type: 'family',
    createdAt: '2023-05-15T10:30:00Z',
    createdBy: 'user-2',
    photoURL: null,
    participants: [
      {
        id: 'user-1',
        name: 'John Doe',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        photoURL: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: 'user-3',
        name: 'Robert Johnson',
        photoURL: 'https://randomuser.me/api/portraits/men/46.jpg'
      },
      {
        id: 'user-4',
        name: 'Emily Davis',
        photoURL: 'https://randomuser.me/api/portraits/women/22.jpg'
      }
    ],
    lastMessage: {
      id: 'msg-1-5',
      text: 'Looking forward to seeing everyone at the reunion!',
      senderId: 'user-2',
      timestamp: '2023-06-10T15:45:00Z',
      read: false
    },
    unreadCount: 2
  },
  {
    id: 'group-2',
    name: null, // Direct message doesn't need a name
    description: null,
    type: 'direct',
    createdAt: '2023-05-20T14:20:00Z',
    createdBy: 'user-1',
    photoURL: null,
    participants: [
      {
        id: 'user-1',
        name: 'John Doe',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        photoURL: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    ],
    lastMessage: {
      id: 'msg-2-3',
      text: 'Can you send me those family photos from last Christmas?',
      senderId: 'user-1',
      timestamp: '2023-06-12T09:30:00Z',
      read: true
    },
    unreadCount: 0
  },
  {
    id: 'group-3',
    name: 'Summer Reunion Planning',
    description: 'Group for planning the summer family reunion',
    type: 'event',
    createdAt: '2023-06-01T08:15:00Z',
    createdBy: 'user-3',
    photoURL: null,
    participants: [
      {
        id: 'user-1',
        name: 'John Doe',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        photoURL: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: 'user-3',
        name: 'Robert Johnson',
        photoURL: 'https://randomuser.me/api/portraits/men/46.jpg'
      }
    ],
    lastMessage: {
      id: 'msg-3-4',
      text: 'I found a great venue for our reunion. Check out the link I shared.',
      senderId: 'user-3',
      timestamp: '2023-06-11T16:20:00Z',
      read: false
    },
    unreadCount: 3
  },
  {
    id: 'group-4',
    name: null,
    description: null,
    type: 'direct',
    createdAt: '2023-05-25T11:40:00Z',
    createdBy: 'user-4',
    photoURL: null,
    participants: [
      {
        id: 'user-1',
        name: 'John Doe',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 'user-4',
        name: 'Emily Davis',
        photoURL: 'https://randomuser.me/api/portraits/women/22.jpg'
      }
    ],
    lastMessage: {
      id: 'msg-4-2',
      text: 'Happy birthday! Hope you have a wonderful day.',
      senderId: 'user-4',
      timestamp: '2023-06-09T08:00:00Z',
      read: true
    },
    unreadCount: 0
  },
  {
    id: 'group-5',
    name: 'Grandparents Anniversary',
    description: 'Planning group for grandparents\' 50th anniversary',
    type: 'event',
    createdAt: '2023-06-05T13:10:00Z',
    createdBy: 'user-2',
    photoURL: null,
    participants: [
      {
        id: 'user-1',
        name: 'John Doe',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        photoURL: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: 'user-3',
        name: 'Robert Johnson',
        photoURL: 'https://randomuser.me/api/portraits/men/46.jpg'
      },
      {
        id: 'user-4',
        name: 'Emily Davis',
        photoURL: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      {
        id: 'user-5',
        name: 'Michael Wilson',
        photoURL: 'https://randomuser.me/api/portraits/men/57.jpg'
      }
    ],
    lastMessage: {
      id: 'msg-5-6',
      text: 'I\'ve created a shared document for gift ideas. Please add your suggestions.',
      senderId: 'user-2',
      timestamp: '2023-06-12T14:15:00Z',
      read: false
    },
    unreadCount: 1
  }
];

// Chat messages by group
export const chatMessages = {
  'group-1': [
    {
      id: 'msg-1-1',
      groupId: 'group-1',
      senderId: 'user-3',
      text: 'Hello everyone! I created this group for our family to stay connected.',
      timestamp: '2023-06-10T10:00:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-1-2',
      groupId: 'group-1',
      senderId: 'user-2',
      text: 'Great idea! It\'s been hard to keep track of everyone\'s updates.',
      timestamp: '2023-06-10T10:05:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-1-3',
      groupId: 'group-1',
      senderId: 'user-4',
      text: 'I agree! By the way, has anyone heard from Uncle Mike recently?',
      timestamp: '2023-06-10T10:10:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-1-4',
      groupId: 'group-1',
      senderId: 'user-1',
      text: 'I spoke with him last week. He\'s doing well and mentioned he might visit next month.',
      timestamp: '2023-06-10T10:15:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-1-5',
      groupId: 'group-1',
      senderId: 'user-2',
      text: 'Looking forward to seeing everyone at the reunion!',
      timestamp: '2023-06-10T15:45:00Z',
      read: false,
      attachments: []
    }
  ],
  'group-2': [
    {
      id: 'msg-2-1',
      groupId: 'group-2',
      senderId: 'user-2',
      text: 'Hi John, how are you doing?',
      timestamp: '2023-06-12T09:15:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-2-2',
      groupId: 'group-2',
      senderId: 'user-1',
      text: 'I\'m doing well, thanks! Just busy with work. How about you?',
      timestamp: '2023-06-12T09:20:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-2-3',
      groupId: 'group-2',
      senderId: 'user-1',
      text: 'Can you send me those family photos from last Christmas?',
      timestamp: '2023-06-12T09:30:00Z',
      read: true,
      attachments: []
    }
  ],
  'group-3': [
    {
      id: 'msg-3-1',
      groupId: 'group-3',
      senderId: 'user-3',
      text: 'Let\'s start planning our summer reunion. Any suggestions for dates?',
      timestamp: '2023-06-11T15:30:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-3-2',
      groupId: 'group-3',
      senderId: 'user-2',
      text: 'How about the last weekend of July? The weather should be perfect then.',
      timestamp: '2023-06-11T15:45:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-3-3',
      groupId: 'group-3',
      senderId: 'user-1',
      text: 'That works for me. Should we look for a venue with outdoor activities?',
      timestamp: '2023-06-11T16:00:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-3-4',
      groupId: 'group-3',
      senderId: 'user-3',
      text: 'I found a great venue for our reunion. Check out the link I shared.',
      timestamp: '2023-06-11T16:20:00Z',
      read: false,
      attachments: [
        {
          id: 'attach-1',
          type: 'link',
          url: 'https://example.com/venue',
          name: 'Summer Retreat Venue'
        }
      ]
    }
  ],
  'group-4': [
    {
      id: 'msg-4-1',
      groupId: 'group-4',
      senderId: 'user-1',
      text: 'Hey Emily, I heard your birthday is coming up!',
      timestamp: '2023-06-08T18:30:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-4-2',
      groupId: 'group-4',
      senderId: 'user-4',
      text: 'Happy birthday! Hope you have a wonderful day.',
      timestamp: '2023-06-09T08:00:00Z',
      read: true,
      attachments: [
        {
          id: 'attach-2',
          type: 'image',
          url: 'https://example.com/birthday-card.jpg',
          name: 'Birthday Card'
        }
      ]
    }
  ],
  'group-5': [
    {
      id: 'msg-5-1',
      groupId: 'group-5',
      senderId: 'user-2',
      text: 'As you all know, Grandma and Grandpa\'s 50th anniversary is coming up in September.',
      timestamp: '2023-06-12T13:00:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-5-2',
      groupId: 'group-5',
      senderId: 'user-2',
      text: 'I think we should plan something special for them. Any ideas?',
      timestamp: '2023-06-12T13:02:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-5-3',
      groupId: 'group-5',
      senderId: 'user-3',
      text: 'How about a surprise party? We could invite all their old friends.',
      timestamp: '2023-06-12T13:10:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-5-4',
      groupId: 'group-5',
      senderId: 'user-4',
      text: 'That\'s a great idea! I can help with the invitations.',
      timestamp: '2023-06-12T13:15:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-5-5',
      groupId: 'group-5',
      senderId: 'user-1',
      text: 'I can handle the catering. Should we book a venue or host it at someone\'s house?',
      timestamp: '2023-06-12T13:30:00Z',
      read: true,
      attachments: []
    },
    {
      id: 'msg-5-6',
      groupId: 'group-5',
      senderId: 'user-2',
      text: 'I\'ve created a shared document for gift ideas. Please add your suggestions.',
      timestamp: '2023-06-12T14:15:00Z',
      read: false,
      attachments: [
        {
          id: 'attach-3',
          type: 'document',
          url: 'https://example.com/gift-ideas-doc',
          name: 'Anniversary Gift Ideas'
        }
      ]
    }
  ]
};

// Helper function to add a new message
export const addMessage = (groupId, text, attachments = []) => {
  const newMessage = {
    id: `msg-${groupId}-${uuidv4().substring(0, 8)}`,
    groupId,
    senderId: currentUser.id,
    text,
    timestamp: new Date().toISOString(),
    read: false,
    attachments
  };
  
  // In a real app, this would be an API call
  // For mock data, we'll just return the new message
  return newMessage;
};

// Helper function to mark messages as read
export const markMessagesAsRead = (groupId) => {
  // In a real app, this would be an API call
  // For mock data, we'll just return success
  return { success: true, groupId };
};

// Helper function to get a chat group by ID
export const getChatGroupById = (groupId) => {
  return chatGroups.find(group => group.id === groupId);
};

// Helper function to get messages for a group
export const getMessagesForGroup = (groupId) => {
  return chatMessages[groupId] || [];
};

// Helper function to create a new chat group
export const createChatGroup = (name, type, participants, description = '') => {
  const newGroup = {
    id: `group-${uuidv4().substring(0, 8)}`,
    name: type === 'direct' ? null : name,
    description: type === 'direct' ? null : description,
    type,
    createdAt: new Date().toISOString(),
    createdBy: currentUser.id,
    photoURL: null,
    participants: [
      {
        id: currentUser.id,
        name: currentUser.name,
        photoURL: currentUser.photoURL
      },
      ...participants
    ],
    lastMessage: null,
    unreadCount: 0
  };
  
  // In a real app, this would be an API call
  // For mock data, we'll just return the new group
  return newGroup;
}; 