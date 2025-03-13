// File: src/layouts/MainLayout.jsx
// Main layout component that wraps the entire application

import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { FamilyProvider } from '../context/FamilyContext';
import { EventProvider } from '../context/EventContext';
import { FileProvider } from '../context/FileContext';
import { setupGlobalErrorHandler } from '../utils/errorHandlers';

// Setup global error handler
setupGlobalErrorHandler();

const MainLayout = () => {
  return (
    <AuthProvider>
      <FamilyProvider>
        <EventProvider>
          <FileProvider>
            <div className="app-container">
              <Outlet />
            </div>
          </FileProvider>
        </EventProvider>
      </FamilyProvider>
    </AuthProvider>
  );
};

export default MainLayout; 