// File: src/components/common/LoadingSpinner.jsx
// Reusable loading spinner component with enhanced animations

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  fullScreen = false,
  text = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };
  
  // Color classes
  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    neutral: 'border-neutral-600',
    white: 'border-white',
    success: 'border-success-500',
    error: 'border-error-500',
    warning: 'border-warning-500',
    info: 'border-info-500'
  };
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  const spinnerVariants = {
    animate: { 
      rotate: 360,
      transition: { 
        duration: 1,
        ease: "linear",
        repeat: Infinity
      }
    }
  };
  
  const textVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.2,
        duration: 0.3
      }
    }
  };
  
  if (fullScreen) {
    return (
      <motion.div 
        className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className={`
            ${sizeClasses[size] || sizeClasses.lg}
            ${colorClasses[color] || colorClasses.primary}
            rounded-full border-t-transparent
          `}
          variants={spinnerVariants}
          animate="animate"
          role="status"
          aria-label="Loading"
        />
        
        {text && (
          <motion.p 
            className="mt-4 text-gray-700 dark:text-gray-300 font-medium"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            {text}
          </motion.p>
        )}
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className={`${className} flex flex-col items-center justify-center`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          ${colorClasses[color] || colorClasses.primary}
          rounded-full border-t-transparent
        `}
        variants={spinnerVariants}
        animate="animate"
        role="status"
        aria-label="Loading"
      />
      
      {text && (
        <motion.p 
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'neutral', 'white', 'success', 'error', 'warning', 'info']),
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
  text: PropTypes.string
};

export default LoadingSpinner; 