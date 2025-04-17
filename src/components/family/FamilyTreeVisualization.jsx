// File: src/components/family/FamilyTreeVisualization.jsx
// Family tree visualization component using React D3 Tree

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Tree from 'react-d3-tree';
import PropTypes from 'prop-types';
import { useFamily } from '../../contexts/FamilyContext';
import { motion, AnimatePresence } from 'framer-motion';

// Custom node component for the tree
const CustomNode = React.memo(({ nodeDatum, onNodeClick, onAddChild, onEditNode, onDeleteNode, toggleNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Check if this is a family unit node (with spouses)
  const isFamilyUnit = nodeDatum.type === 'familyUnit' || 
                       (nodeDatum.attributes && nodeDatum.attributes.type === 'familyUnit');
  
  // Determine node color based on gender or generation
  const getNodeColor = (gender) => {
    if (gender === 'male') {
      return 'border-primary-500 bg-primary-50/80 dark:bg-primary-900/50';
    } else if (gender === 'female') {
      return 'border-secondary-500 bg-secondary-50/80 dark:bg-secondary-900/50';
    } else {
      return 'border-accent-500 bg-accent-50/80 dark:bg-accent-900/50';
    }
  };

  // Format name from firstName and lastName
  const getFullName = (firstName, lastName) => {
    return `${firstName || ''} ${lastName || ''}`.trim();
  };

  // Check if node has children or hidden children
  const hasChildren = (nodeDatum.children && nodeDatum.children.length > 0) || 
                      (nodeDatum._children && nodeDatum._children.length > 0);
  
  // Check if node is collapsed
  const isCollapsed = nodeDatum.__rd3t && nodeDatum.__rd3t.collapsed;

  // Render a family unit node (with spouses)
  if (isFamilyUnit) {
    const spouses = nodeDatum.attributes.spouses || [];
    
    return (
      <g>
        <foreignObject
          width={360}
          height={120}
          x={-180}
          y={-60}
          className="overflow-visible"
        >
          <div className="family-unit-container flex items-center justify-center">
            {/* Render spouses side by side */}
            <div className="flex items-center">
              {spouses.map((spouse, index) => (
                <React.Fragment key={spouse.id}>
                  {/* Spouse node */}
                  <div 
                    className={`tree-node-glass ${getNodeColor(spouse.gender)} hover:shadow-glass-strong transition-all duration-300 mx-2 w-[160px]`}
                    onClick={() => onNodeClick({ ...nodeDatum, spouseIndex: index })}
                  >
                    {/* Avatar/Image if available */}
                    {spouse.photoURL ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 border-2 border-white shadow-md">
                        <img 
                          src={spouse.photoURL} 
                          alt={getFullName(spouse.firstName, spouse.lastName)} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full mx-auto mb-2 bg-white/30 backdrop-blur-sm flex items-center justify-center text-xl font-semibold text-gray-700 border-2 border-white/50 shadow-md">
                        {(spouse.firstName || '').charAt(0)}
                      </div>
                    )}
                    
                    {/* Name and details */}
                    <div className="text-center">
                      <div className="font-semibold text-sm truncate">
                        {getFullName(spouse.firstName, spouse.lastName)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector between spouses */}
                  {index < spouses.length - 1 && (
                    <div className="h-[2px] w-8 bg-gray-400 mx-1"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Expand/Collapse button for nodes with children */}
            {hasChildren && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <button
                  className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md border ${isCollapsed 
                    ? 'bg-primary-500 text-white hover:bg-primary-600 border-primary-600' 
                    : 'bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 border-gray-200'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(nodeDatum.id);
                  }}
                  aria-label={isCollapsed ? "Expand" : "Collapse"}
                  title={isCollapsed ? "Expand children" : "Collapse children"}
                >
                  {isCollapsed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
            )}
            
            {/* Collapsed indicator */}
            {isCollapsed && hasChildren && (
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                <span className="bg-white/80 dark:bg-gray-800/80 px-1 py-0.5 rounded-sm text-[10px]">
                  {nodeDatum._children ? nodeDatum._children.length : '+'} hidden
                </span>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="absolute top-0 right-0 mt-1 mr-1">
              <button 
                className="w-6 h-6 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
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
                        onAddChild({ ...nodeDatum, relationshipMode: 'child' });
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
                        onAddChild({ ...nodeDatum, relationshipMode: 'parent' });
                        setMenuOpen(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      Add Parent
                    </button>
                    {/* <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddChild({ ...nodeDatum, relationshipMode: 'partner' });
                        setMenuOpen(false);
                      }}
                      disabled
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Add Partner
                    </button> */}
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
                    {hasChildren && (
                      <button 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNode(nodeDatum.id);
                          setMenuOpen(false);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                        </svg>
                        {isCollapsed ? 'Expand' : 'Collapse'}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  // Regular individual node (not a family unit)
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
          className={`tree-node-glass ${getNodeColor(nodeDatum.attributes?.gender)} hover:shadow-glass-strong transition-all duration-300 ${isCollapsed && hasChildren ? 'border-dashed' : ''}`}
          onClick={() => onNodeClick(nodeDatum)}
        >
          {/* Avatar/Image if available */}
          {nodeDatum.attributes?.photoURL ? (
            <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 border-2 border-white shadow-md">
              <img 
                src={nodeDatum.attributes.photoURL} 
                alt={getFullName(nodeDatum.attributes?.firstName, nodeDatum.attributes?.lastName)} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full mx-auto mb-2 bg-white/30 backdrop-blur-sm flex items-center justify-center text-xl font-semibold text-gray-700 border-2 border-white/50 shadow-md">
              {getFullName(nodeDatum.attributes?.firstName, nodeDatum.attributes?.lastName).charAt(0)}
            </div>
          )}
          
          {/* Name and details */}
          <div className="text-center">
            <div className="font-semibold text-sm truncate">
              {getFullName(nodeDatum.attributes?.firstName, nodeDatum.attributes?.lastName)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {nodeDatum.attributes?.dateOfBirth && (
                <span>{new Date(nodeDatum.attributes.dateOfBirth).getFullYear()}</span>
              )}
              {nodeDatum.attributes?.dateOfBirth && nodeDatum.attributes?.dateOfDeath && (
                <span> - </span>
              )}
              {nodeDatum.attributes?.dateOfDeath && (
                <span>{new Date(nodeDatum.attributes.dateOfDeath).getFullYear()}</span>
              )}
            </div>
          </div>
          
          {/* Expand/Collapse button for nodes with children */}
          {hasChildren && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <button
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md border ${isCollapsed 
                  ? 'bg-primary-500 text-white hover:bg-primary-600 border-primary-600' 
                  : 'bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 border-gray-200'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(nodeDatum.id);
                }}
                aria-label={isCollapsed ? "Expand" : "Collapse"}
                title={isCollapsed ? "Expand children" : "Collapse children"}
              >
                {isCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </button>
            </div>
          )}
          
          {/* Collapsed indicator */}
          {isCollapsed && hasChildren && (
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
              <span className="bg-white/80 dark:bg-gray-800/80 px-1 py-0.5 rounded-sm text-[10px]">
                {nodeDatum._children ? nodeDatum._children.length : '+'} hidden
              </span>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="absolute top-0 right-0 mt-1 mr-1">
            <button 
              className="w-6 h-6 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
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
                      onAddChild({ ...nodeDatum, relationshipMode: 'child' });
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
                      onAddChild({ ...nodeDatum, relationshipMode: 'parent' });
                      setMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Add Parent
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddChild({ ...nodeDatum, relationshipMode: 'partner' });
                      setMenuOpen(false);
                    }}
                    disabled
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Add Partner
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
                  {hasChildren && (
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNode(nodeDatum.id);
                        setMenuOpen(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                      </svg>
                      {isCollapsed ? 'Expand' : 'Collapse'}
                    </button>
                  )}
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

const FamilyTreeVisualization = ({ treeData, onNodeClick, onAddChild, onEditNode, onDeleteNode }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [initialRender, setInitialRender] = useState(true);
  const [collapsedNodes, setCollapsedNodes] = useState({});
  const [processedTreeData, setProcessedTreeData] = useState(null);
  
  const treeContainerRef = useRef(null);
  const treeWrapperRef = useRef(null);
  
  // Process tree data to apply collapsed state
  useEffect(() => {
    if (!treeData) {
      console.log('No tree data provided to FamilyTreeVisualization');
      setProcessedTreeData(null);
      return;
    }
    
    console.log('Processing tree data for visualization:', treeData);
    
    // Deep clone the tree data to avoid modifying the original
    const processNode = (node) => {
      if (!node) return null;
      
      // Create a new node object to avoid modifying the original
      const newNode = { ...node };
      
      // Add __rd3t property for collapse state
      newNode.__rd3t = {
        collapsed: collapsedNodes[node.id] || false
      };
      
      // Process children if they exist
      if (node.children && node.children.length > 0) {
        if (newNode.__rd3t.collapsed) {
          // Store children in _children for later expansion
          newNode._children = node.children.map(child => processNode(child));
          // Remove children from the processed data when collapsed
          delete newNode.children;
        } else {
          // Process children normally when expanded
          newNode.children = node.children.map(child => processNode(child));
        }
      }
      
      // Handle case where node was previously collapsed and has _children
      if (node._children && !newNode.__rd3t.collapsed) {
        // Move _children back to children when expanded
        newNode.children = node._children.map(child => processNode(child));
        delete newNode._children;
      }
      
      return newNode;
    };
    
    try {
      const processed = processNode(treeData);
      console.log('Processed tree data:', processed);
      setProcessedTreeData(processed);
    } catch (error) {
      console.error('Error processing tree data:', error);
      setProcessedTreeData(null);
    }
  }, [treeData, collapsedNodes]);
  
  // Update dimensions when the container is resized
  useEffect(() => {
    if (treeContainerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
          
          // Only set translate on initial render or when tree data changes
          if (initialRender || !processedTreeData) {
            setTranslate({ x: width / 2, y: height / 5 });
            setInitialRender(false);
          }
        }
      });
      
      resizeObserver.observe(treeContainerRef.current);
      
      return () => {
        if (treeContainerRef.current) {
          resizeObserver.unobserve(treeContainerRef.current);
        }
      };
    }
  }, [initialRender, processedTreeData]);
  
  // Toggle node collapse state
  const toggleNode = (nodeId) => {
    console.log('Toggling node:', nodeId);
    setCollapsedNodes(prev => {
      const newState = {
        ...prev,
        [nodeId]: !prev[nodeId]
      };
      console.log('New collapsed state:', newState);
      return newState;
    });
  };
  
  // Handle node click
  const handleNodeClick = (nodeDatum) => {
    setSelectedNode(nodeDatum);
    if (onNodeClick) {
      onNodeClick(nodeDatum);
    }
  };
  
  // Zoom controls with improved range
  const handleZoomIn = () => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.min(prevZoom + 0.1, 3);
      return newZoom;
    });
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.max(prevZoom - 0.1, 0.1);
      return newZoom;
    });
  };
  
  const handleResetZoom = () => {
    if (treeContainerRef.current) {
      const { width, height } = treeContainerRef.current.getBoundingClientRect();
      
      // Reset zoom and position
      setZoomLevel(1);
      setTranslate({ x: width / 2, y: height / 5 });
      
      // Force re-render with new translate
      setInitialRender(true);
    }
  };
  
  // Custom path component for connecting nodes
  const straightPathFunc = ({ source, target }) => {
    return `M${source.x},${source.y}L${target.x},${target.y}`;
  };
  
  // Handle fullscreen toggle
  const handleFullscreen = () => {
    if (treeContainerRef.current) {
      if (!document.fullscreenElement) {
        treeContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };
  
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
        <div className="text-center text-xs font-medium text-gray-700 dark:text-gray-300 py-1">
          {Math.round(zoomLevel * 100)}%
        </div>
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
        <button 
          className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
          onClick={handleFullscreen}
          aria-label="Toggle fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
      </div>
      
      {processedTreeData ? (
        <Tree
          data={processedTreeData}
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
              toggleNode={toggleNode}
            />
          )}
          zoom={zoomLevel}
          scaleExtent={{ min: 0.1, max: 3 }}
          nodeSize={{ x: 200, y: 150 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          enableLegacyTransitions={true}
          transitionDuration={800}
          collapsible={true}
          ref={treeWrapperRef}
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {treeData ? 'Processing Tree Data...' : 'No Family Tree Data'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {treeData ? 
                'Please wait while we prepare your family tree visualization.' : 
                'Start by adding your first family member to begin building your family tree.'}
            </p>
            {!treeData && (
              <button
                onClick={() => {
                  if (onAddChild) {
                    onAddChild({ id: null, name: 'Root' });
                  }
                }}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Add First Member
              </button>
            )}
          </div>
        </div>
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
  toggleNode: PropTypes.func.isRequired,
};

FamilyTreeVisualization.propTypes = {
  treeData: PropTypes.object,
  onNodeClick: PropTypes.func.isRequired,
  onAddChild: PropTypes.func.isRequired,
  onEditNode: PropTypes.func.isRequired,
  onDeleteNode: PropTypes.func.isRequired,
};

export default FamilyTreeVisualization; 