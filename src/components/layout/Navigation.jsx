// File: src/components/layout/Navigation.jsx
// Responsive navigation component with mobile support

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Handle scroll event to change navigation appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md dark:bg-neutral-900' : 'bg-white/80 backdrop-blur-md dark:bg-neutral-900/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Vaanshika</span>
              </Link>
            </div>
            
            {/* Desktop navigation links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 sm:items-center">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/family-tree" 
                className={`nav-link ${isActive('/family-tree') ? 'nav-link-active' : ''}`}
              >
                Family Tree
              </Link>
              <Link 
                to="/events" 
                className={`nav-link ${isActive('/events') ? 'nav-link-active' : ''}`}
              >
                Events
              </Link>
              <Link 
                to="/media" 
                className={`nav-link ${isActive('/media') ? 'nav-link-active' : ''}`}
              >
                Media
              </Link>
              <Link 
                to="/chat" 
                className={`nav-link ${isActive('/chat') ? 'nav-link-active' : ''}`}
              >
                Chat
              </Link>
            </div>
          </div>
          
          {/* User menu and mobile menu button */}
          <div className="flex items-center">
            {/* User dropdown (desktop) */}
            {currentUser ? (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="relative ml-3">
                  <div>
                    <button 
                      type="button" 
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      {currentUser.photoURL ? (
                        <img 
                          className="h-8 w-8 rounded-full" 
                          src={currentUser.photoURL} 
                          alt={currentUser.displayName || 'User'} 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                          {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isOpen && (
                    <div 
                      className="glassmorphism origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        role="menuitem"
                      >
                        Your Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        role="menuitem"
                      >
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex sm:items-center sm:ml-6 sm:space-x-4">
                <Link 
                  to="/login" 
                  className="nav-link"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button 
                type="button" 
                className="mobile-menu-button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/dashboard" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/dashboard') 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/family-tree" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/family-tree') 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            Family Tree
          </Link>
          <Link 
            to="/events" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/events') 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            Events
          </Link>
          <Link 
            to="/media" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/media') 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            Media
          </Link>
          <Link 
            to="/chat" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/chat') 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            Chat
          </Link>
        </div>
        
        {/* Mobile user menu */}
        {currentUser ? (
          <div className="pt-4 pb-3 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {currentUser.photoURL ? (
                  <img 
                    className="h-10 w-10 rounded-full" 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                  {currentUser.displayName || 'User'}
                </div>
                <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {currentUser.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Your Profile
              </Link>
              <Link 
                to="/settings" 
                className="block px-4 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-center space-x-4 px-4">
              <Link 
                to="/login" 
                className="block px-4 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Log in
              </Link>
              <Link 
                to="/register" 
                className="btn-primary"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 