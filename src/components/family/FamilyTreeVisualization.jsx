// File: src/components/family/FamilyTreeVisualization.jsx
// Family tree visualization component using React D3 Tree

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Tree from 'react-d3-tree';
import PropTypes from 'prop-types';
import { useFamily } from '../../hooks/useFamily';
import { motion, AnimatePresence } from 'framer-motion';
import { familyTreeData } from '../../utils/demoData';

// Custom node component for the tree
const CustomNode = React.memo(({ nodeDatum, onNodeClick, onAddChild, onEditNode, onDeleteNode }) => {
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
                          src={nodeDatum?.attributes?.imageUrl} 
                alt={nodeDatum?.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full mx-auto mb-2 bg-white/30 backdrop-blur-sm flex items-center justify-center text-xl font-semibold text-gray-700 border-2 border-white/50 shadow-md">
              {nodeDatum?.name?.charAt(0)}
            </div>
          )}
          
          {/* Name and details */}
          <div className="text-center">
            <div className="font-semibold text-sm truncate">{nodeDatum?.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {nodeDatum?.attributes?.birthDate && (
                <span>{new Date(nodeDatum?.attributes?.birthDate).getFullYear()}</span>
              )}
              {nodeDatum?.attributes?.birthDate && nodeDatum?.attributes?.deathDate && (
                <span> - </span>
              )}
              {nodeDatum?.attributes?.deathDate && (
                <span>{new Date(nodeDatum?.attributes?.deathDate).getFullYear()}</span>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-0 right-0 mt-1 mr-1">
            <button 
              className="w-6 h-6 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  className="absolute top-8 right-0 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button 
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddChild(nodeDatum);
                      setMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Child
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditNode(nodeDatum);
                      setMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-900/30 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(nodeDatum);
                      setMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
});

const FamilyTreeVisualization = ({ onNodeClick, onAddChild, onEditNode, onDeleteNode }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [treeData, setTreeData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const treeContainerRef = useRef(null);
  const { getFamilyTree } = useFamily();
  
  // Convert the raw family data to the format expected by react-d3-tree
  const formatTreeData = useCallback((data) => {
    if (!data) return null;
    
    // Helper function to convert a person and their descendants
    const formatPerson = (person) => {
      const formattedPerson = {
        name: person.name,
        id: person.id,
        attributes: {
          gender: person.gender,
          birthDate: person.birthDate,
          deathDate: person.deathDate,
          imageUrl: person.photo
        },
        children: []
      };
      
      // Add spouse if exists
      if (person.spouse) {
        formattedPerson.attributes.spouse = {
          name: person.spouse.name,
          id: person.spouse.id,
          gender: person.spouse.gender,
          birthDate: person.spouse.birthDate,
          deathDate: person.spouse.deathDate,
          imageUrl: person.spouse.photo
        };
      }
      
      // Add children recursively
      if (person.children && person.children.length > 0) {
        formattedPerson.children = person.children.map(child => formatPerson(child));
      }
      
      return formattedPerson;
    };
    
    return formatPerson(data);
  }, []);
  
  // Fetch family tree data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use demo data instead of fetching from API
        const demoTreeData = familyTreeData;
        const formattedData = formatTreeData(demoTreeData);
        setTreeData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching family tree data:', err);
        setError('Failed to load family tree data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [formatTreeData]);
  
  // Update dimensions when the container is resized
  useEffect(() => {
    if (treeContainerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
          setTranslate({ x: width / 2, y: height / 5 });
        }
      });
      
      resizeObserver.observe(treeContainerRef.current);
      
      return () => {
        if (treeContainerRef.current) {
          resizeObserver.unobserve(treeContainerRef.current);
        }
      };
    }
  }, []);
  
  // Handle node click
  const handleNodeClick = (nodeDatum) => {
    setSelectedNode(nodeDatum);
    if (onNodeClick) {
      onNodeClick(nodeDatum);
    }
  };
  
  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleResetZoom = () => {
    setZoomLevel(1);
    if (treeContainerRef.current) {
      const { width, height } = treeContainerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 5 });
    }
  };
  
  // Custom path component for connecting nodes
  const straightPathFunc = ({ source, target }) => {
    return `M${source.x},${source.y}L${target.x},${target.y}`;
  };
  
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  //     </div>
  //   );
  // }
  
  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full text-center p-4">
  //       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-error-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  //       </svg>
  //       <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Error Loading Family Tree</h3>
  //       <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
  //       <button 
  //         className="btn-primary px-4 py-2 rounded-lg"
  //         onClick={() => window.location.reload()}
  //       >
  //         Retry
  //       </button>
  //     </div>
  //   );
  // }
  
  return (
    <div className="relative h-full w-full" ref={treeContainerRef}>
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg shadow-glass">
        <button 
          className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button 
          className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        <button 
          className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
          onClick={handleResetZoom}
          aria-label="Reset view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
      </div>
      
      {treeData && (
        <Tree
        data={treeData}
        translate={translate}
        orientation="vertical"
        pathFunc={straightPathFunc}
        renderCustomNodeElement={(rd3tProps) => (
          <CustomNode
            {...rd3tProps}
            onNodeClick={handleNodeClick}
            onAddChild={onAddChild}
            onEditNode={onEditNode}
            onDeleteNode={onDeleteNode}
          />
        )}
        zoom={zoomLevel}
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        nodeSize={{ x: 200, y: 150 }}
        enableLegacyTransitions={true}
        transitionDuration={800}
      />
      )}
    </div>
  );
};

CustomNode.propTypes = {
  nodeDatum: PropTypes.object.isRequired,
  onNodeClick: PropTypes.func.isRequired,
  onAddChild: PropTypes.func.isRequired,
  onEditNode: PropTypes.func.isRequired,
  onDeleteNode: PropTypes.func.isRequired,
};
export default FamilyTreeVisualization; 