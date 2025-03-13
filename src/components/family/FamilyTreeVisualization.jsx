// File: src/components/family/FamilyTreeVisualization.jsx
// Family tree visualization component using React D3 Tree

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Tree from 'react-d3-tree';
import PropTypes from 'prop-types';
import { useFamily } from '../../hooks/useFamily';
import { motion, AnimatePresence } from 'framer-motion';

// Custom node component for the tree
const CustomNode = ({ nodeDatum, onNodeClick, onAddChild, onEditNode, onDeleteNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Determine node color based on gender or generation
  const getNodeColor = () => {
    if (nodeDatum.attributes?.gender === 'male') {
      return 'border-primary-500 bg-primary-50/80 dark:bg-primary-900/50';
    } else if (nodeDatum.attributes?.gender === 'female') {
      return 'border-secondary-500 bg-secondary-50/80 dark:bg-secondary-900/50';
    } else {
      return 'border-accent-500 bg-accent-50/80 dark:bg-accent-900/50';
    }
  };

  return (
    <g>
      {/* Node circle */}
      <foreignObject
        width={180}
        height={120}
        x={-90}
        y={-60}
        className="overflow-visible"
      >
        <div 
          className={`tree-node-glass ${getNodeColor()} hover:shadow-glass-strong transition-all duration-300`}
          onClick={() => onNodeClick(nodeDatum)}
        >
          {/* Avatar/Image if available */}
          {nodeDatum.attributes?.imageUrl ? (
            <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 border-2 border-white shadow-md">
              <img 
                src={nodeDatum.attributes.imageUrl} 
                alt={nodeDatum.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full mx-auto mb-2 bg-white/30 backdrop-blur-sm flex items-center justify-center text-xl font-semibold text-gray-700 border-2 border-white/50 shadow-md">
              {nodeDatum.name.charAt(0)}
            </div>
          )}
          
          {/* Name */}
          <div className="tree-node-name font-medium text-gray-800 dark:text-gray-100">{nodeDatum.name}</div>
          
          {/* Details */}
          {nodeDatum.attributes?.birthDate && (
            <div className="tree-node-details text-xs text-gray-600 dark:text-gray-300">
              {new Date(nodeDatum.attributes.birthDate).getFullYear()} - 
              {nodeDatum.attributes?.deathDate ? new Date(nodeDatum.attributes.deathDate).getFullYear() : 'Present'}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-center mt-2 space-x-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 bg-white/30 backdrop-blur-sm rounded-full shadow-sm text-gray-700 hover:bg-white/50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              aria-label="More options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  className="absolute z-10 mt-8 -ml-24 w-36 card-glass shadow-glass py-1 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeClick(nodeDatum);
                      setMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    View Details
                  </button>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddChild(nodeDatum);
                      setMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Child
                  </button>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditNode(nodeDatum);
                      setMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(nodeDatum);
                      setMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

CustomNode.propTypes = {
  nodeDatum: PropTypes.object.isRequired,
  onNodeClick: PropTypes.func,
  onAddChild: PropTypes.func,
  onEditNode: PropTypes.func,
  onDeleteNode: PropTypes.func
};

// Main tree visualization component
const FamilyTreeVisualization = ({ 
  treeData, 
  onNodeClick, 
  onAddChild, 
  onEditNode, 
  onDeleteNode 
}) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const treeContainer = useRef(null);
  const { loading } = useFamily();

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (treeContainer.current) {
        setDimensions({
          width: treeContainer.current.offsetWidth,
          height: treeContainer.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Center the tree when data or dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 5
      });
    }
  }, [dimensions, treeData]);

  // Custom path generator for connecting the nodes
  const straightPathFunc = useCallback((linkDatum, orientation) => {
    const { source, target } = linkDatum;
    return orientation === 'horizontal'
      ? `M${source.y},${source.x}L${target.y},${target.x}`
      : `M${source.x},${source.y}L${target.x},${target.y}`;
  }, []);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    if (dimensions.width > 0 && dimensions.height > 0) {
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 5
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader">
          <div className="spinner"></div>
          <p className="mt-4 text-primary-600">Loading family tree...</p>
        </div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <motion.div 
        className="flex flex-col justify-center items-center h-full p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-6">🌱</div>
        <h3 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">No Family Tree Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Start building your family tree by adding your first family member. Create a legacy that can be shared with generations to come.
        </p>
        <motion.button 
          className="btn-primary-glass px-6 py-3 rounded-lg text-lg"
          onClick={() => onAddChild({ name: 'Root', children: [] })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Family Tree
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="family-tree-container h-full w-full relative" ref={treeContainer}>
      {/* Zoom and orientation controls */}
      <div className="absolute top-4 right-4 z-10 card-glass p-1 rounded-full shadow-glass flex space-x-1">
        <button 
          className="p-2 text-gray-700 hover:bg-white/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="p-2 text-gray-700 hover:bg-white/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="p-2 text-gray-700 hover:bg-white/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={handleResetZoom}
          aria-label="Reset view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Tree visualization */}
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}>
        <Tree
          data={treeData}
          translate={translate}
          orientation="vertical"
          pathFunc={straightPathFunc}
          nodeSize={{ x: 220, y: 150 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          renderCustomNodeElement={(rd3tProps) => (
            <CustomNode
              {...rd3tProps}
              onNodeClick={onNodeClick}
              onAddChild={onAddChild}
              onEditNode={onEditNode}
              onDeleteNode={onDeleteNode}
            />
          )}
          pathClassFunc={() => 'tree-connector'}
        />
      </div>
    </div>
  );
};

FamilyTreeVisualization.propTypes = {
  treeData: PropTypes.object,
  onNodeClick: PropTypes.func,
  onAddChild: PropTypes.func,
  onEditNode: PropTypes.func,
  onDeleteNode: PropTypes.func
};

FamilyTreeVisualization.defaultProps = {
  onNodeClick: () => {},
  onAddChild: () => {},
  onEditNode: () => {},
  onDeleteNode: () => {}
};

export default FamilyTreeVisualization; 