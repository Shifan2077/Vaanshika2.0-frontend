// File: src/components/auth/AuthWrapper.jsx
// Auth wrapper component for authentication pages

import React from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../common/ErrorBoundary';
import { motion } from 'framer-motion';

const AuthWrapper = () => {
  return (
    <motion.div 
      className="auth-wrapper min-h-screen w-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-content w-full h-full">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
      
      {/* Fixed background elements that appear on all auth pages */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800"></div>
    </motion.div>
  );
};

export default AuthWrapper; 