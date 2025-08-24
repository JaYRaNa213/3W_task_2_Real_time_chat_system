<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0b7ce567-2810-4593-b9ac-ec1af393511e" />﻿
# 3W Real-Time Chat Website

<div align="center">

![Chat Application](https://img.shields.io/badge/Chat-Real%20Time-blue?style=for-the-badge&logo=socket.io)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Real%20Time-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A full-stack real-time chat application built with modern web technologies**

*Featuring user authentication, multiple chat rooms, message history, online users tracking, and guest access*

[🚀 Live Demo](https://real-time-chat-system-lyart.vercel.app/) • [📖 Documentation](https://drive.google.com/file/d/1jqBaer4P2sQVtPO1-13DRXmJED-pUlfc/view?usp=sharing) 

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Installation & Setup](#-installation--setup)
- [📊 API Reference](#-api-reference)
- [🔌 Socket.io Events](#-socketio-events)
- [🌊 Frontend Flow](#-frontend-flow)
- [🔧 Environment Variables](#-environment-variables)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## 🎯 Project Overview

**3W Real-Time Chat** is a modern, full-featured chat application that provides seamless real-time communication experience. Built with cutting-edge technologies, it offers both authenticated user experience and guest access functionality.


<img src="./img/chat.png" alt="contextSwap" width="900" />

### Key Capabilities

🔐 **Secure Authentication** - Register and login with JWT-based security  
👥 **Multi-Room Support** - Join and manage multiple chat rooms simultaneously  
⚡ **Real-Time Messaging** - Instant message delivery with Socket.io  
👀 **Live User Tracking** - See who's online in each room  
⌨️ **Typing Indicators** - Visual feedback when users are typing  
🎭 **Guest Access** - Chat without registration required  
📚 **Message History** - Persistent chat storage in MongoDB  
📱 **Responsive Design** - Works perfectly on desktop and mobile  

---

## ✨ Features

### Core Features
| Feature | Status | Description |
|---------|--------|-------------|
| 🔐 User Authentication | ✅ | Secure registration & login with JWT |
| 👥 Multi-Room Chat | ✅ | Join multiple chat rooms simultaneously |
| ⚡ Real-Time Messaging | ✅ | Instant message delivery via Socket.io |
| 👀 Online Status | ✅ | Live tracking of online users per room |
| ⌨️ Typing Indicators | ✅ | Visual feedback when users are typing |
| 🎭 Guest Access | ✅ | Chat without creating an account |
| 📚 Message History | ✅ | Persistent chat storage in MongoDB |
| 📱 Responsive UI | ✅ | Mobile-friendly responsive design |

### Advanced Features
| Feature | Status | Description |
|---------|--------|-------------|
| 🔄 Auto-Reconnection | ✅ | Automatic reconnection on network issues |
| 🕒 Message Timestamps | ✅ | Track when messages were sent |
| 🏠 Room Management | ✅ | Create and manage custom chat rooms |
| 👤 User Profiles | 🔄 | Basic user profile information |
| 📱 Mobile App | 🔄 | React Native mobile application |
| 📤 File Sharing | 🔄 | Share files and images |
| 🔔 Push Notifications | 🔄 | Real-time notifications |

---

## 🛠️ Tech Stack

<div align="center">


</div>

### Detailed Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Material-UI | Modern UI with responsive components |
| **State Management** | Context API + Hooks | Centralized state management |
| **Real-Time** | Socket.io Client | Bidirectional real-time communication |
| **Routing** | React Router 6 | Client-side navigation |
| **Backend** | Node.js + Express | RESTful API server |
| **WebSocket** | Socket.io Server | Real-time event handling |
| **Database** | MongoDB + Mongoose | Document-based data storage |
| **Authentication** | JWT + bcrypt | Secure user authentication |
| **Deployment** | Vercel | Render|

---

## 📁 Project Structure

```
3w-chat-website/
├── 📄 README.md                 # Project documentation
├── 📄 .gitignore               # Git ignore rules
├── 📄 tree.js                  # Directory tree generator
│
├── 📁 client/                   # React Frontend Application
│   ├── 📁 public/              # Static assets
│   │   ├── index.html          # HTML template
│   │   ├── favicon.ico         # App icon
│   │   ├── logo192.png         # PWA icon (192x192)
│   │   ├── logo512.png         # PWA icon (512x512)
│   │   ├── manifest.json       # PWA manifest
│   │   └── robots.txt          # SEO robots file
│   │
│   ├── 📁 src/                 # Source code
│   │   ├── 📄 App.jsx          # Main app component
│   │   ├── 📄 index.js         # React entry point
│   │   ├── 📄 styles.css       # Global styles
│   │   │
│   │   ├── 📁 api/             # API utilities
│   │   │   ├── auth.js         # Authentication API
│   │   │   ├── http.js         # HTTP client setup
│   │   │   ├── messages.js     # Messages API
│   │   │   └── rooms.js        # Rooms API
│   │   │
│   │   ├── 📁 components/      # Reusable components
│   │   │   ├── 📁 ChatRoom/    # Chat room components
│   │   │   │   ├── ChatRoom.jsx        # Main chat interface
│   │   │   │   ├── MessageInput.jsx    # Message input component
│   │   │   │   ├── MessageList.jsx     # Messages display
│   │   │   │   ├── OnlineUsersList.jsx # Online users sidebar
│   │   │   │   └── TypingIndicator.jsx # Typing status indicator
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── PrivateRoute.jsx # Protected route wrapper
│   │   │   └── RoomsSidebar.jsx # Rooms navigation sidebar
│   │   │
│   │   ├── 📁 context/         # React Context providers
│   │   │   ├── AuthContext.jsx # Authentication context
│   │   │   └── SocketContext.jsx # Socket.io context
│   │   │
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   │   └── useAuth.js      # Authentication hook
│   │   │
│   │   ├── 📁 pages/           # Main application pages
│   │   │   ├── Chat.jsx        # Chat interface page
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Login.jsx       # Login page
│   │   │   └── Register.jsx    # Registration page
│   │   │
│   │   └── 📁 utils/           # Utility functions
│   │
│   ├── 📄 .env                 # Environment variables
│   ├── 📄 .gitignore          # Client git ignore
│   ├── 📄 package.json        # NPM dependencies
│   └── 📄 package-lock.json   # Dependency lock file
│
└── 📁 server/                  # Node.js Backend Application
    ├── 📁 src/                 # Server source code
    │   ├── 📄 index.js         # Server entry point
    │   ├── 📄 socket.js        # Socket.io configuration
    │   │
    │   ├── 📁 middleware/      # Express middleware
    │   │   └── auth.js         # JWT authentication middleware
    │   │
    │   ├── 📁 models/          # Database models (Mongoose)
    │   │   ├── User.model.js   # User data model
    │   │   ├── Room.model.js   # Chat room model
    │   │   └── Message.model.js # Message data model
    │   │
    │   ├── 📁 routes/          # API route handlers
    │   │   ├── auth.route.js   # Authentication routes
    │   │   ├── rooms.route.js  # Room management routes
    │   │   └── messages.route.js # Message handling routes
    │   │
    │   ├── 📁 utils/           # Server utilities
    │   │   └── users.js        # User management utilities
    │   │
    │   └── 📁 public/          # Static files (if any)
    │
    ├── 📄 test-socket.js       # Socket.io testing script
    ├── 📄 .env                 # Server environment variables
    ├── 📄 package.json        # Server NPM dependencies
    └── 📄 package-lock.json   # Server dependency lock file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16.0.0 or higher)
- **MongoDB** (local or cloud instance)
- **Vercel And Render Account** (for deployment)

### Quick Start on Github 🚀

1. **Fork this Repo**
   ```bash
   # Visit: https://github.com/JaYRaNa213/3W_task_2_Real_time_chat_system/tree/main
   # Click "Fork" to create your own copy
   ```

2. **Configure Environment Variables**
   
   Navigate to the Secrets tab in your Repl and add:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://real-time-chat-system-lyart.vercel.app/
   ```

3. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd server
   npm install
   
   # Frontend dependencies  
   cd ../client
   npm install
   ```


### Local Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/JaYRaNa213/3W_task_2_Real_time_chat_system
   cd 3w-chat-website
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup** (New terminal)
   ```bash
   cd client
   npm install
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 📊 API Reference

### 🔐 Authentication Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| `POST` | `/api/auth/register` | `{username, email, password}` | `{token, user}` | Register new user |
| `POST` | `/api/auth/login` | `{username, password}` | `{token, user}` | Login existing user |
| `GET` | `/api/auth/verify` | Headers: `Authorization: Bearer <token>` | `{user}` | Verify JWT token |

### 🏠 Room Management

| Method | Endpoint | Headers | Response | Description |
|--------|----------|---------|----------|-------------|
| `GET` | `/api/rooms` | `Authorization: Bearer <token>` | `[{id, name, description, userCount}]` | Get all available rooms |
| `POST` | `/api/rooms` | `Authorization: Bearer <token>` | `{room}` | Create new room |
| `GET` | `/api/rooms/:id` | `Authorization: Bearer <token>` | `{room, users}` | Get specific room details |
| `PUT` | `/api/rooms/:id` | `Authorization: Bearer <token>` | `{room}` | Update room information |

### 💬 Message Handling

| Method | Endpoint | Query Parameters | Response | Description |
|--------|----------|------------------|----------|-------------|
| `GET` | `/api/messages` | `roomId`, `page=1`, `limit=50` | `{messages[], totalPages, currentPage}` | Get paginated chat history |
| `POST` | `/api/messages` | Body: `{roomId, message}` | `{message}` | Send message to room |
| `DELETE` | `/api/messages/:id` | - | `{success}` | Delete specific message |

### Example API Calls

```javascript
// Register a new user
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

// Get chat history
const messages = await fetch(`/api/messages?roomId=${roomId}&page=1&limit=20`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🔌 Socket.io Events

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `joinRoom` | `{username, room, token?}` | Join a specific chat room |
| `leaveRoom` | `{username, room}` | Leave current chat room |
| `chatMessage` | `{username, room, message, timestamp}` | Send message to room |
| `typing` | `{username, room, isTyping: boolean}` | Toggle typing indicator |
| `disconnect` | - | User disconnected from server |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `roomJoined` | `{room, users[], message}` | Confirmation of successful room join |
| `newMessage` | `{id, username, message, timestamp, room}` | New message broadcasted to room |
| `userJoined` | `{username, room, timestamp}` | New user joined the room |
| `userLeft` | `{username, room, timestamp}` | User left the room |
| `onlineUsers` | `{room, users[], count}` | Updated list of online users |
| `typing` | `{username, room, isTyping}` | Typing indicator update |
| `error` | `{type, message, details}` | Error notifications |

### Socket.io Implementation Example

```javascript
// Client-side Socket.io usage
import io from 'socket.io-client';

const socket = io('ws://localhost:5000');

// Join a room
socket.emit('joinRoom', {
  username: 'JohnDoe',
  room: 'general',
  token: localStorage.getItem('token')
});

// Listen for new messages
socket.on('newMessage', (data) => {
  console.log('New message:', data);
  setMessages(prev => [...prev, data]);
});

// Send a message
const sendMessage = (message) => {
  socket.emit('chatMessage', {
    username: user.username,
    room: currentRoom,
    message: message,
    timestamp: new Date().toISOString()
  });
};
```

---

## 🌊 Frontend Flow

```mermaid
graph TD
    A[Landing Page] --> B{User Choice}
    B -->|Login| C[Login Form]
    B -->|Register| D[Register Form]
    B -->|Guest| E[Guest Setup]
    
    C --> F{Auth Success?}
    D --> F
    E --> G[Chat Interface]
    
    F -->|Yes| G
    F -->|No| H[Error Message]
    H --> B
    
    G --> I[Room Selection]
    I --> J[Join Room]
    J --> K[Chat Features]
    
    K --> L[Send Messages]
    K --> M[View Online Users]
    K --> N[Typing Indicators]
    K --> O[Message History]
```

### Detailed User Journey

1. **🏠 Landing Page (`/`)**
   - Welcome message with app introduction
   - Three main options: Login, Register, Guest Access
   - Responsive hero section with feature highlights

2. **🔐 Authentication (`/login`, `/register`)**
   - **Login**: Username/password with validation
   - **Register**: Username, email, password with confirmation
   - Form validation with real-time feedback
   - JWT token stored in localStorage on success
   - Automatic redirect to chat interface

3. **💬 Chat Interface (`/chat`)**
   - **Sidebar**: Room list with unread message indicators
   - **Main Area**: Active chat room with message history
   - **Online Panel**: List of currently online users
   - **Message Input**: Rich text input with emoji support
   - **Navigation**: Easy room switching and settings

4. **🎭 Guest Access**
   - Simplified onboarding with username selection
   - Limited features (no message history persistence)
   - Option to upgrade to full account during session
   - Temporary session management

---

## 🔧 Environment Variables

### Server Configuration (`.env` in `/server`)

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/chat-app
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
JWT_EXPIRE=7d

# Server Settings
PORT=5000
NODE_ENV=development

# CORS Settings (for production)
CLIENT_URL=https://real-time-chat-system-lyart.vercel.app/
ALLOWED_ORIGINS= ADD multiples

# Optional: Redis for session management
REDIS_URL=redis://localhost:6379
```

### Client Configuration (`.env` in `/client`)

```env
# API Configuration
REACT_APP_API_URL=localhost:5000
REACT_APP_SOCKET_URL=localhost:5000

# App Metadata
REACT_APP_NAME=3W Real-Time Chat
REACT_APP_VERSION=1.0.0
REACT_APP_DESCRIPTION=Modern real-time chat application

# Feature Flags
REACT_APP_ENABLE_GUEST_MODE=true
REACT_APP_ENABLE_PUSH_NOTIFICATIONS=false
REACT_APP_MAX_MESSAGE_LENGTH=500
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Testing
- [ ] User registration with valid credentials
- [ ] User registration with invalid/duplicate credentials
- [ ] User login with correct credentials
- [ ] User login with incorrect credentials
- [ ] JWT token verification and expiration
- [ ] Password hashing verification

#### Chat Functionality
- [ ] Real-time message sending and receiving
- [ ] Multiple users in the same room
- [ ] Room switching without message loss
- [ ] Message history loading and pagination
- [ ] Typing indicators display correctly
- [ ] Online users list updates in real-time

#### Guest Mode Testing
- [ ] Guest user can join rooms
- [ ] Guest user can send/receive messages
- [ ] Guest user limitations work correctly
- [ ] Guest to registered user upgrade flow

#### UI/UX Testing
- [ ] Responsive design on mobile devices
- [ ] Dark/light theme switching (if implemented)
- [ ] Accessibility features
- [ ] Browser compatibility (Chrome, Firefox, Safari)

### Automated Testing Scripts

```bash
# Test basic socket connection
node server/test-socket.js

# Simulate multiple users
node server/multi-test-socket.js

# Run frontend tests
cd client && npm test

# Run backend API tests
cd server && npm test
```

### Load Testing

```javascript
// Example load test with Socket.io
const io = require('socket.io-client');

const createUser = (userId) => {
  const socket = io('http://localhost:5000');
  
  socket.emit('joinRoom', {
    username: `User${userId}`,
    room: 'general'
  });
  
  setInterval(() => {
    socket.emit('chatMessage', {
      username: `User${userId}`,
      room: 'general',
      message: `Hello from User${userId}!`
    });
  }, 2000);
};

// Simulate 50 concurrent users
for (let i = 1; i <= 50; i++) {
  createUser(i);
}
```

---

## 🚀 Deployment

### Deployment on Vercel And Render

1. **Prepare for Production**
   ```bash
   # Set production environment
   NODE_ENV=production
   PORT=5000
   ```

2. **Configure Build Scripts**
   ```json
   {
     "scripts": {
       "build": "cd client && npm run build",
       "start": "cd server && npm start",
       "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm start\""
     }
   }
   ```


```

---

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a new branch for your feature
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a pull request

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Commit Messages**: Use conventional commit format
- **Testing**: Add tests for new features
- **Documentation**: Update README and code comments
- **Performance**: Consider performance implications

### Areas for Contribution

- 🎨 **UI/UX Improvements** - Better design and user experience
- 🔧 **Feature Development** - New chat features and functionality
- 🐛 **Bug Fixes** - Report and fix bugs
- 📚 **Documentation** - Improve documentation and examples
- 🧪 **Testing** - Add automated tests and improve test coverage
- ♿ **Accessibility** - Make the app more accessible
- 🌍 **Internationalization** - Add multi-language support

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Jay Rana

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👤 Author

<div align="center">

**Jay Prakash**

*Full-Stack Developer & Open Source Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-JaYRaNa213-181717?style=for-the-badge&logo=github)](https://github.com/JaYRaNa213)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Jay%20Rana-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/jay-prakash-367538313/)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jayrana0909@gmail.com)

*"Building the future of real-time communication, one message at a time."*

</div>

---

## 🌟 Acknowledgments

Special thanks to the amazing open-source community and these fantastic tools:

- **[Socket.io](https://socket.io/)** - Enabling real-time bidirectional event-based communication
- **[React](https://reactjs.org/)** - Building user interfaces with component-based architecture
- **[Material-UI](https://mui.com/)** - Providing beautiful React components
- **[Node.js](https://nodejs.org/)** - JavaScript runtime built on Chrome's V8 engine
- **[MongoDB](https://www.mongodb.com/)** - Document-based database for modern applications
- **[Express.js](https://expressjs.com/)** - Fast, unopinionated web framework for Node.js

---

## 🗺️ Roadmap

### 📋 Phase 1: Foundation (Completed ✅)
- ✅ Basic real-time messaging
- ✅ User authentication system
- ✅ Multiple chat rooms support
- ✅ Online users tracking
- ✅ Message history persistence
- ✅ Responsive UI design

### 🚀 Phase 2: Enhancement (In Progress 🔄)
- 🔄 File and image sharing
- 🔄 Voice message support
- 🔄 Message reactions (emoji)
- 🔄 Private messaging system
- 🔄 User profile customization
- 🔄 Advanced room management

### 🌟 Phase 3: Advanced Features (Planned 📅)
- 📅 Video calling integration
- 📅 Screen sharing capabilities
- 📅 Message scheduling
- 📅 Advanced moderation tools
- 📅 Analytics dashboard
- 📅 API rate limiting

### 📱 Phase 4: Mobile & Platform Expansion (Future 🔮)
- 🔮 React Native mobile app
- 🔮 Desktop application (Electron)
- 🔮 PWA enhancements
- 🔮 Push notifications
- 🔮 Offline message synchronization

---

<div align="center">

---

**🚀 Built with ❤️ using React, Node.js, Socket.io, and MongoDB**

**Deployed on [vercel] - The collaborative cloud development platform**

*Star this repository if you found it helpful! ⭐*

---

</div>




