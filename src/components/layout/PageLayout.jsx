// File: src/components/layout/PageLayout.jsx
// Reusable page layout component with consistent styling

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Navigation from './Navigation';

const PageLayout = ({ 
  title, 
  subtitle, 
  children, 
  actions,
  showBackButton = false,
  onBack,
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navigation />
      
      <main className="pt-16">
        {/* Page header */}
        {(title || actions) && (
          <header className="bg-white dark:bg-neutral-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {showBackButton && (
                    <button
                      onClick={onBack}
                      className="mr-3 p-1 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      aria-label="Go back"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  <div>
                    <motion.h1 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-neutral-900 dark:text-neutral-100"
                    >
                      {title}
                    </motion.h1>
                    
                    {subtitle && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
                      >
                        {subtitle}
                      </motion.p>
                    )}
                  </div>
                </div>
                
                {actions && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex space-x-3"
                  >
                    {actions}
                  </motion.div>
                )}
              </div>
            </div>
          </header>
        )}
        
        {/* Page content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

PageLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  showBackButton: PropTypes.bool,
  onBack: PropTypes.func,
  className: PropTypes.string
};

export default PageLayout; 