// File: src/components/common/Loader.jsx
// Reusable loader component for loading states

import React from 'react';

const Loader = ({ size = 'medium', fullScreen = false, text = 'Loading...' }) => {
  const sizeClass = `loader-${size}`;
  const containerClass = fullScreen ? 'loader-fullscreen' : 'loader-container';
  
  return (
    <div className={containerClass}>
      <div className={`loader ${sizeClass}`}>
        <div className="loader-spinner"></div>
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loader; 