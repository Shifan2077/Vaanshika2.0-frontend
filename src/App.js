import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FamilyTreePage from './pages/FamilyTreePage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import EventsPage from './pages/EventsPage';
import MediaPage from './pages/MediaPage';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyEmail from './components/auth/VerifyEmail';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { ChatProvider } from './contexts/ChatContext';

// Styles
import './App.css';
import './styles/index.css'; // Import our custom styles
import './styles/chatStyles.css'; // Import chat styles
import './styles/familyTreeStyles.css'; // Import family tree styles

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FamilyProvider>
          <ChatProvider>
            <Router>
              <Routes>
                {/* Main Layout Routes */}
                <Route path="/" element={<MainLayout />}>
                  {/* Public Routes */}
                  <Route index element={<LandingPage />} />
                  
                  {/* Auth Routes */}
                  <Route path="login" element={<AuthLayout />}>
                    <Route index element={<Login />} />
                  </Route>
                  <Route path="register" element={<AuthLayout />}>
                    <Route index element={<Register />} />
                  </Route>
                  <Route path="forgot-password" element={<AuthLayout />}>
                    <Route index element={<ForgotPassword />} />
                  </Route>
                  <Route path="verify-email/:token" element={<AuthLayout />}>
                    <Route index element={<VerifyEmail />} />
                  </Route>
                  
                  {/* Protected Routes */}
                  <Route path="dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                  </Route>
                  <Route path="family-tree" element={<DashboardLayout />}>
                    <Route index element={<FamilyTreePage />} />
                    {/* Add nested routes for family tree operations */}
                  </Route>
                  <Route path="profile" element={<DashboardLayout />}>
                    <Route index element={<ProfilePage />} />
                  </Route>
                  <Route path="chat" element={<DashboardLayout />}>
                    <Route index element={<ChatPage />} />
                    <Route path=":roomId" element={<ChatPage />} />
                  </Route>
                  <Route path="events" element={<DashboardLayout />}>
                    <Route index element={<EventsPage />} />
                    {/* Add nested routes for event operations */}
                  </Route>
                  <Route path="media" element={<DashboardLayout />}>
                    <Route index element={<MediaPage />} />
                    {/* Add nested routes for media operations */}
                  </Route>
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </Router>
          </ChatProvider>
        </FamilyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
