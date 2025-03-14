// File: src/utils/demoData.js
// Demo data for UI visualization while backend is unavailable

// Demo user data
export const demoUserData = {
  id: 'user123',
  firstName: 'Adarsh',
  lastName: 'More',
  email: 'adarsh@example.com',
  photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  location: 'Mumbai, India',
  bio: 'Software developer and family historian',
  joinedDate: '2023-01-15',
  role: 'admin'
};

// Demo family members data
export const demoFamilyMembers = [
  {
    id: 'member1',
    firstName: 'Rajesh',
    lastName: 'More',
    relationship: 'Father',
    photoURL: 'https://randomuser.me/api/portraits/men/42.jpg',
    dateOfBirth: '1965-03-10',
    gender: 'male',
    isAlive: true,
    location: 'Mumbai, India',
    bio: 'Retired teacher and avid gardener',
    contactInfo: {
      email: 'rajesh@example.com',
      phone: '+91 98765 43210'
    }
  },
  {
    id: 'member2',
    firstName: 'Sunita',
    lastName: 'More',
    relationship: 'Mother',
    photoURL: 'https://randomuser.me/api/portraits/women/42.jpg',
    dateOfBirth: '1968-07-22',
    gender: 'female',
    isAlive: true,
    location: 'Mumbai, India',
    bio: 'Homemaker and excellent cook',
    contactInfo: {
      email: 'sunita@example.com',
      phone: '+91 98765 43211'
    }
  },
  {
    id: 'member3',
    firstName: 'Priya',
    lastName: 'More',
    relationship: 'Sister',
    photoURL: 'https://randomuser.me/api/portraits/women/22.jpg',
    dateOfBirth: '1992-11-05',
    gender: 'female',
    isAlive: true,
    location: 'Pune, India',
    bio: 'Doctor at City Hospital',
    contactInfo: {
      email: 'priya@example.com',
      phone: '+91 98765 43212'
    }
  },
  {
    id: 'member4',
    firstName: 'Amit',
    lastName: 'More',
    relationship: 'Brother',
    photoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
    dateOfBirth: '1995-09-18',
    gender: 'male',
    isAlive: true,
    location: 'Bangalore, India',
    bio: 'Software engineer at Tech Corp',
    contactInfo: {
      email: 'amit@example.com',
      phone: '+91 98765 43213'
    }
  },
  {
    id: 'member5',
    firstName: 'Ramesh',
    lastName: 'More',
    relationship: 'Grandfather',
    photoURL: 'https://randomuser.me/api/portraits/men/67.jpg',
    dateOfBirth: '1940-01-15',
    gender: 'male',
    isAlive: false,
    deathDate: '2018-05-20',
    location: 'Mumbai, India',
    bio: 'Veteran and community leader',
    contactInfo: {
      email: '',
      phone: ''
    }
  },
  {
    id: 'member6',
    firstName: 'Lata',
    lastName: 'More',
    relationship: 'Grandmother',
    photoURL: 'https://randomuser.me/api/portraits/women/67.jpg',
    dateOfBirth: '1945-04-30',
    gender: 'female',
    isAlive: true,
    location: 'Mumbai, India',
    bio: 'Retired school principal',
    contactInfo: {
      email: 'lata@example.com',
      phone: '+91 98765 43214'
    }
  }
];

// Demo family tree data
export const familyTreeData = {
  id: 'member5',
  name: 'Ramesh More',
  gender: 'male',
  birthDate: '1940-01-15',
  deathDate: '2018-05-20',
  photo: 'https://randomuser.me/api/portraits/men/67.jpg',
  spouse: {
    id: 'member6',
    name: 'Lata More',
    gender: 'female',
    birthDate: '1945-04-30',
    photo: 'https://randomuser.me/api/portraits/women/67.jpg'
  },
  children: [
    {
      id: 'member1',
      name: 'Rajesh More',
      gender: 'male',
      birthDate: '1965-03-10',
      photo: 'https://randomuser.me/api/portraits/men/42.jpg',
      spouse: {
        id: 'member2',
        name: 'Sunita More',
        gender: 'female',
        birthDate: '1968-07-22',
        photo: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      children: [
        {
          id: 'user123',
          name: 'Adarsh More',
          gender: 'male',
          birthDate: '1990-05-15',
          photo: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          id: 'member3',
          name: 'Priya More',
          gender: 'female',
          birthDate: '1992-11-05',
          photo: 'https://randomuser.me/api/portraits/women/22.jpg'
        },
        {
          id: 'member4',
          name: 'Amit More',
          gender: 'male',
          birthDate: '1995-09-18',
          photo: 'https://randomuser.me/api/portraits/men/22.jpg'
        }
      ]
    },
    {
      id: 'member7',
      name: 'Suresh More',
      gender: 'male',
      birthDate: '1970-08-12',
      photo: 'https://randomuser.me/api/portraits/men/43.jpg',
      spouse: {
        id: 'member8',
        name: 'Meena More',
        gender: 'female',
        birthDate: '1972-09-25',
        photo: 'https://randomuser.me/api/portraits/women/43.jpg'
      },
      children: [
        {
          id: 'member9',
          name: 'Rahul More',
          gender: 'male',
          birthDate: '1995-02-18',
          photo: 'https://randomuser.me/api/portraits/men/23.jpg'
        },
        {
          id: 'member10',
          name: 'Neha More',
          gender: 'female',
          birthDate: '1998-06-30',
          photo: 'https://randomuser.me/api/portraits/women/23.jpg'
        }
      ]
    }
  ]
};

// Demo events data
export const demoEventsData = [
  {
    id: 'event1',
    title: 'Annual Family Reunion',
    description: 'Our yearly gathering to celebrate family bonds and create new memories together.',
    date: '2023-12-25',
    time: '11:00',
    location: 'Grandma\'s House, Mumbai',
    organizer: 'user123',
    attendees: ['member1', 'member2', 'member3', 'member4', 'member6'],
    type: 'reunion',
    isRecurring: true,
    recurringPattern: 'yearly',
    photos: [
      'https://images.unsplash.com/photo-1542736667-069246bdbc6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ]
  },
  {
    id: 'event2',
    title: 'Priya\'s Birthday Celebration',
    description: 'Join us to celebrate Priya\'s 31st birthday with cake and fun activities.',
    date: '2023-11-05',
    time: '18:30',
    location: 'Blue Moon Restaurant, Pune',
    organizer: 'member1',
    attendees: ['user123', 'member1', 'member2', 'member4'],
    type: 'birthday',
    isRecurring: true,
    recurringPattern: 'yearly',
    photos: [
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ]
  },
  {
    id: 'event3',
    title: 'Memorial Service for Grandfather',
    description: 'A gathering to honor the memory of our beloved grandfather, Ramesh More.',
    date: '2023-05-20',
    time: '10:00',
    location: 'City Memorial Park, Mumbai',
    organizer: 'member1',
    attendees: ['user123', 'member1', 'member2', 'member3', 'member4', 'member6'],
    type: 'memorial',
    isRecurring: true,
    recurringPattern: 'yearly',
    photos: [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ]
  },
  {
    id: 'event4',
    title: 'Family Picnic',
    description: 'A day of outdoor fun, games, and food with the whole family.',
    date: '2023-10-15',
    time: '09:00',
    location: 'City Park, Mumbai',
    organizer: 'user123',
    attendees: ['member1', 'member2', 'member3', 'member4', 'member6'],
    type: 'outing',
    isRecurring: false,
    photos: [
      'https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ]
  },
  {
    id: 'event5',
    title: 'Diwali Celebration',
    description: 'Annual family gathering to celebrate Diwali with lights, sweets, and fireworks.',
    date: '2023-11-12',
    time: '18:00',
    location: 'Family Home, Mumbai',
    organizer: 'member1',
    attendees: ['user123', 'member1', 'member2', 'member3', 'member4', 'member6'],
    type: 'festival',
    isRecurring: true,
    recurringPattern: 'yearly',
    photos: [
      'https://images.unsplash.com/photo-1574438053255-061b9e0dfd99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ]
  }
];

// Demo chat data
export const demoChatRooms = [
  {
    id: 'chat1',
    name: 'Family Group',
    participants: ['user123', 'member1', 'member2', 'member3', 'member4', 'member6'],
    createdAt: '2023-01-20',
    lastMessage: {
      id: 'msg123',
      sender: 'member1',
      senderName: 'Rajesh More',
      content: 'Has everyone decided what to bring for the picnic next week?',
      timestamp: '2023-10-10T15:30:00Z',
      isRead: true
    },
    unreadCount: 0
  },
  {
    id: 'chat2',
    name: 'Siblings Chat',
    participants: ['user123', 'member3', 'member4'],
    createdAt: '2023-02-15',
    lastMessage: {
      id: 'msg456',
      sender: 'member3',
      senderName: 'Priya More',
      content: 'I\'ll be visiting home this weekend. Anyone else around?',
      timestamp: '2023-10-11T09:45:00Z',
      isRead: false
    },
    unreadCount: 3
  },
  {
    id: 'chat3',
    name: 'Event Planning',
    participants: ['user123', 'member1', 'member2', 'member3'],
    createdAt: '2023-03-10',
    lastMessage: {
      id: 'msg789',
      sender: 'user123',
      senderName: 'Adarsh More',
      content: 'I\'ve created a shared document with all the event details. Please check and add your inputs.',
      timestamp: '2023-10-09T18:20:00Z',
      isRead: true
    },
    unreadCount: 0
  }
];

export const demoChatMessages = {
  'chat1': [
    {
      id: 'msg121',
      sender: 'member2',
      senderName: 'Sunita More',
      content: 'Good morning everyone! Hope you all have a wonderful day.',
      timestamp: '2023-10-10T08:00:00Z',
      isRead: true
    },
    {
      id: 'msg122',
      sender: 'member3',
      senderName: 'Priya More',
      content: 'Good morning Mom! Have a great day too.',
      timestamp: '2023-10-10T08:15:00Z',
      isRead: true
    },
    {
      id: 'msg123',
      sender: 'member1',
      senderName: 'Rajesh More',
      content: 'Has everyone decided what to bring for the picnic next week?',
      timestamp: '2023-10-10T15:30:00Z',
      isRead: true
    }
  ],
  'chat2': [
    {
      id: 'msg451',
      sender: 'user123',
      senderName: 'Adarsh More',
      content: 'Hey guys, should we plan something special for Mom and Dad\'s anniversary?',
      timestamp: '2023-10-11T09:00:00Z',
      isRead: true
    },
    {
      id: 'msg452',
      sender: 'member4',
      senderName: 'Amit More',
      content: 'Definitely! I was thinking maybe a surprise dinner?',
      timestamp: '2023-10-11T09:15:00Z',
      isRead: true
    },
    {
      id: 'msg453',
      sender: 'user123',
      senderName: 'Adarsh More',
      content: 'That sounds great! Let\'s coordinate offline.',
      timestamp: '2023-10-11T09:30:00Z',
      isRead: true
    },
    {
      id: 'msg454',
      sender: 'member3',
      senderName: 'Priya More',
      content: 'I\'ll be visiting home this weekend. Anyone else around?',
      timestamp: '2023-10-11T09:45:00Z',
      isRead: false
    },
    {
      id: 'msg455',
      sender: 'member3',
      senderName: 'Priya More',
      content: 'Also, I found some old family photos we could use for the anniversary.',
      timestamp: '2023-10-11T09:46:00Z',
      isRead: false
    },
    {
      id: 'msg456',
      sender: 'member3',
      senderName: 'Priya More',
      content: 'Will share them when I come over.',
      timestamp: '2023-10-11T09:47:00Z',
      isRead: false
    }
  ],
  'chat3': [
    {
      id: 'msg781',
      sender: 'member1',
      senderName: 'Rajesh More',
      content: 'We need to start planning for the annual family reunion. Any suggestions for the venue this year?',
      timestamp: '2023-10-09T10:00:00Z',
      isRead: true
    },
    {
      id: 'msg782',
      sender: 'member2',
      senderName: 'Sunita More',
      content: 'How about we host it at our place this time? We have enough space in the backyard.',
      timestamp: '2023-10-09T10:15:00Z',
      isRead: true
    },
    {
      id: 'msg783',
      sender: 'member3',
      senderName: 'Priya More',
      content: 'That sounds good! I can help with the decorations and food arrangements.',
      timestamp: '2023-10-09T10:30:00Z',
      isRead: true
    },
    {
      id: 'msg784',
      sender: 'user123',
      senderName: 'Adarsh More',
      content: 'Great idea! I can handle the invitations and coordination.',
      timestamp: '2023-10-09T10:45:00Z',
      isRead: true
    },
    {
      id: 'msg785',
      sender: 'member1',
      senderName: 'Rajesh More',
      content: 'Perfect! Let\'s make a list of all the things we need to arrange.',
      timestamp: '2023-10-09T11:00:00Z',
      isRead: true
    },
    {
      id: 'msg786',
      sender: 'user123',
      senderName: 'Adarsh More',
      content: 'I\'ll create a shared document for that.',
      timestamp: '2023-10-09T18:15:00Z',
      isRead: true
    },
    {
      id: 'msg789',
      sender: 'user123',
      senderName: 'Adarsh More',
      content: 'I\'ve created a shared document with all the event details. Please check and add your inputs.',
      timestamp: '2023-10-09T18:20:00Z',
      isRead: true
    }
  ]
};

// Demo media/files data
export const mediaFiles = [
  {
    id: 'file1',
    name: 'Family Reunion 2022.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    uploadedBy: 'user123',
    uploadedAt: '2022-12-26T14:30:00Z',
    size: '2.4 MB',
    tags: ['reunion', 'family', '2022']
  },
  {
    id: 'file2',
    name: 'Grandparents Anniversary.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1567697692461-55d12ec9e9d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    uploadedBy: 'member1',
    uploadedAt: '2022-05-15T10:15:00Z',
    size: '1.8 MB',
    tags: ['anniversary', 'grandparents']
  },
  {
    id: 'file3',
    name: 'Family History Document.pdf',
    type: 'document',
    url: '#',
    uploadedBy: 'member6',
    uploadedAt: '2022-03-10T09:45:00Z',
    size: '4.2 MB',
    tags: ['history', 'document']
  },
  {
    id: 'file4',
    name: 'Diwali Celebration 2022.mp4',
    type: 'video',
    url: '#',
    uploadedBy: 'member2',
    uploadedAt: '2022-11-15T18:30:00Z',
    size: '75.6 MB',
    tags: ['diwali', 'celebration', 'video']
  },
  {
    id: 'file5',
    name: 'Family Recipes.docx',
    type: 'document',
    url: '#',
    uploadedBy: 'member2',
    uploadedAt: '2022-08-22T11:20:00Z',
    size: '1.5 MB',
    tags: ['recipes', 'food', 'tradition']
  },
  {
    id: 'file6',
    name: 'Old Family Photo 1980.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    uploadedBy: 'member1',
    uploadedAt: '2022-02-18T15:40:00Z',
    size: '1.2 MB',
    tags: ['old', 'photo', 'history', '1980']
  },
  {
    id: 'file7',
    name: 'Family Tree Document.pdf',
    type: 'document',
    url: '#',
    uploadedBy: 'user123',
    uploadedAt: '2022-01-05T13:10:00Z',
    size: '3.7 MB',
    tags: ['family tree', 'document', 'history']
  },
  {
    id: 'file8',
    name: 'Birthday Party 2022.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    uploadedBy: 'member3',
    uploadedAt: '2022-11-06T20:15:00Z',
    size: '2.1 MB',
    tags: ['birthday', 'party', 'celebration']
  }
];

// Demo notifications data
export const notifications = [
  {
    id: 'notif1',
    type: 'event',
    title: 'New Event: Family Picnic',
    message: 'A new family event has been created for October 15, 2023.',
    timestamp: '2023-10-01T09:30:00Z',
    isRead: false,
    relatedId: 'event4'
  },
  {
    id: 'notif2',
    type: 'chat',
    title: 'New Messages in Siblings Chat',
    message: 'You have 3 unread messages in the Siblings Chat.',
    timestamp: '2023-10-11T09:47:30Z',
    isRead: false,
    relatedId: 'chat2'
  },
  {
    id: 'notif3',
    type: 'birthday',
    title: 'Upcoming Birthday: Priya More',
    message: 'Priya\'s birthday is coming up on November 5, 2023.',
    timestamp: '2023-10-29T08:00:00Z',
    isRead: true,
    relatedId: 'member3'
  },
  {
    id: 'notif4',
    type: 'media',
    title: 'New Family Photos Uploaded',
    message: 'Rajesh More has uploaded new family photos.',
    timestamp: '2023-10-05T14:15:00Z',
    isRead: true,
    relatedId: 'file1'
  },
  {
    id: 'notif5',
    type: 'reminder',
    title: 'Event Reminder: Diwali Celebration',
    message: 'Reminder: Diwali Celebration is scheduled for November 12, 2023.',
    timestamp: '2023-11-10T09:00:00Z',
    isRead: false,
    relatedId: 'event5'
  }
];

// Demo timeline data
export const timelineEvents = [
  {
    id: 'timeline1',
    title: 'Family Migration to Mumbai',
    description: 'The More family relocated from their ancestral village to Mumbai for better opportunities.',
    date: '1960-06-15',
    type: 'migration',
    media: [
      {
        id: 'media1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        caption: 'The family arriving in Mumbai'
      }
    ],
    relatedMembers: ['member5', 'member6']
  },
  {
    id: 'timeline2',
    title: 'Grandparents\' Wedding',
    description: 'Ramesh and Lata More got married in a traditional ceremony.',
    date: '1962-11-30',
    type: 'wedding',
    media: [
      {
        id: 'media2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741347686-c1e331fcb4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        caption: 'Wedding ceremony'
      }
    ],
    relatedMembers: ['member5', 'member6']
  },
  {
    id: 'timeline3',
    title: 'Birth of Rajesh More',
    description: 'Rajesh More was born to Ramesh and Lata More.',
    date: '1965-03-10',
    type: 'birth',
    media: [
      {
        id: 'media3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        caption: 'Baby Rajesh with his parents'
      }
    ],
    relatedMembers: ['member1', 'member5', 'member6']
  },
  {
    id: 'timeline4',
    title: 'Parents\' Wedding',
    description: 'Rajesh and Sunita More got married.',
    date: '1988-12-05',
    type: 'wedding',
    media: [
      {
        id: 'media4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        caption: 'Wedding ceremony'
      }
    ],
    relatedMembers: ['member1', 'member2']
  },
  {
    id: 'timeline5',
    title: 'Birth of Adarsh More',
    description: 'Adarsh More was born to Rajesh and Sunita More.',
    date: '1990-05-15',
    type: 'birth',
    media: [
      {
        id: 'media5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        caption: 'Baby Adarsh with his parents'
      }
    ],
    relatedMembers: ['user123', 'member1', 'member2']
  },
  {
    id: 'timeline6',
    title: 'Grandfather\'s Passing',
    description: 'Ramesh More passed away peacefully surrounded by family.',
    date: '2018-05-20',
    type: 'death',
    media: [
      {
        id: 'media6',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        caption: 'Memorial service'
      }
    ],
    relatedMembers: ['member5']
  }
];

// Demo settings data
export const userSettings = {
  notifications: {
    email: true,
    push: true,
    events: true,
    birthdays: true,
    chat: true,
    mediaUploads: false
  },
  privacy: {
    profileVisibility: 'family',
    contactInfoVisibility: 'family',
    mediaVisibility: 'family',
    allowTagging: true,
    allowComments: true
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium',
    colorScheme: 'default'
  },
  language: 'en',
  timeZone: 'Asia/Kolkata'
}; 