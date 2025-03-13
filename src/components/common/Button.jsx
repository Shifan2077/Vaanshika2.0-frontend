// File: src/components/common/Button.jsx
// Reusable button component with different variants and animations

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  icon = null,
  iconPosition = 'left',
  loading = false,
  loadingText = 'Loading...',
  animated = true,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-70 cursor-not-allowed' : '';
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    disabledClass,
    'flex items-center justify-center transition-all duration-200',
    className
  ].filter(Boolean).join(' ');

  // Animation variants
  const buttonVariants = {
    hover: animated ? { scale: 1.03, y: -1 } : {},
    tap: animated ? { scale: 0.97, y: 1 } : {}
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Button content
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner />
          <span>{loadingText}</span>
        </>
      );
    }

    if (icon) {
      return (
        <>
          {iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          <span>{children}</span>
          {iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      );
    }

    return children;
  };

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={!disabled && !loading ? onClick : undefined}
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      variants={buttonVariants}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link', 'outline', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  animated: PropTypes.bool
};

export default Button; 