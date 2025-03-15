// File: src/pages/FamilyTreePage.jsx
// Family tree page with visualization and member management

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../contexts/FamilyContext';
import FamilyTreeVisualization from '../components/family/FamilyTreeVisualization';
import FamilyMemberForm from '../components/family/FamilyMemberForm';
import Loader from '../components/common/Loader';
import '../styles/treeStyles.css';
import familyService from '../services/familyService';

const FamilyTreePage = () => {
  const navigate = useNavigate();
  const { 
    familyTree, 
    familyTrees,
    treeData,
    familyMembers,
    loading: contextLoading, 
    error: contextError, 
    fetchFamilyTree,
    fetchAllFamilyTrees,
    createTree,
    addMember, 
    updateMember, 
    removeMember,
    deleteTree,
    setFamilyTree,
    setFamilyMembers,
    setError: setContextError,
    selectedTreeId,
    setSelectedTreeId
  } = useFamily();
  
  // Add local state for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [parentId, setParentId] = useState(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [showNewTreeForm, setShowNewTreeForm] = useState(false);
  const [newTreeData, setNewTreeData] = useState({ name: '', description: '' });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Load family trees data from backend
  useEffect(() => {
    fetchAllFamilyTrees();
  }, [fetchAllFamilyTrees]);

  // Handle node click in the tree visualization
  const handleNodeClick = (nodeDatum) => {
    setSelectedMember(nodeDatum);
    setShowMemberDetails(true);
    setShowForm(false);
  };

  // Handle adding a child to a member
  const handleAddChild = (parentNode) => {
    setParentId(parentNode.id);
    setSelectedMember(null);
    setFormMode('add');
    setShowForm(true);
    setShowMemberDetails(false);
  };

  // Handle editing a member
  const handleEditMember = (nodeDatum) => {
    setSelectedMember(nodeDatum);
    setFormMode('edit');
    setShowForm(true);
    setShowMemberDetails(false);
  };

  // Handle deleting a member
  const handleDeleteMember = async (nodeDatum) => {
    if (window.confirm(`Are you sure you want to delete ${nodeDatum.name}?`)) {
      try {
        await removeMember(nodeDatum.id);
      } catch (err) {
        console.error('Error deleting member:', err);
      }
    }
  };

  // Handle form submission for adding/editing a member
  const handleFormSubmit = async (memberData) => {
    try {
      console.log('Form submission with mode:', formMode, 'and data:', memberData);
      
      if (formMode === 'add') {
        // Add parent ID if adding a child to an existing member
        if (parentId) {
          memberData.parentId = parentId;
          console.log('Adding child with parent ID:', parentId);
        } else {
          console.log('Adding root member to tree:', selectedTreeId);
        }
        
        // Make sure we're using the selected tree ID
        if (!selectedTreeId) {
          console.error('No selected tree ID when trying to add member');
          alert('No family tree selected. Please select or create a family tree first.');
          return;
        }
        
        // Ensure the tree ID is properly formatted
        const treeId = String(selectedTreeId).trim();
        console.log('Using formatted treeId for adding member:', treeId);
        
        const result = await addMember(memberData);
        console.log("Member added:", result);
        
        if (!result || !result.success) {
          alert('Failed to add family member: ' + (result?.error || 'Unknown error'));
          return;
        }
      } else if (formMode === 'edit' && selectedMember) {
        await updateMember(selectedMember.id, memberData);
      }
      
      // Close form after successful submission
      setShowForm(false);
      setSelectedMember(null);
      setParentId(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to add family member. Please try again.');
    }
  };

  // Close member details panel
  const handleCloseDetails = () => {
    setShowMemberDetails(false);
    setSelectedMember(null);
  };

  // Close form panel
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedMember(null);
    setParentId(null);
  };

  // Start a new family tree
  const handleStartNewTree = () => {
    setShowNewTreeForm(true);
  };

  // Handle new tree form input changes
  const handleNewTreeInputChange = (e) => {
    const { name, value } = e.target;
    setNewTreeData({
      ...newTreeData,
      [name]: value
    });
  };

  // Create a new family tree
  const handleCreateNewTree = async (e) => {
    e.preventDefault();
    
    if (!newTreeData.name) {
      alert('Please enter a name for your family tree');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Creating new tree with data:', newTreeData);
      const response = await createTree(newTreeData);
      console.log('Create tree response:', response);
      
      if (response && response.success) {
        setShowNewTreeForm(false);
        setNewTreeData({ name: '', description: '' });
        
        // Set the selected tree ID
        if (response.treeId) {
          const treeId = String(response.treeId).trim();
          console.log('Setting selected tree ID to:', treeId);
          setSelectedTreeId(treeId);
          
          // Also update the family tree data
          if (response.data) {
            setFamilyTree(response.data);
            setFamilyMembers([]);
          }
        }
        
        // Show form to add root member
        setFormMode('add');
        setParentId(null);
        setShowForm(true);
      } else {
        alert('Failed to create family tree. Please try again.');
      }
    } catch (err) {
      console.error('Error creating family tree:', err);
      alert('Failed to create family tree. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Select a family tree to view
  const handleSelectTree = async (treeId) => {
    // Ensure the tree ID is properly formatted
    const formattedTreeId = String(treeId).trim();
    console.log('Selecting tree with ID:', formattedTreeId);
    setSelectedTreeId(formattedTreeId);
    
    try {
      setLoading(true);
      
      // Fetch the specific family tree data
      const response = await familyService.getFamilyTreeById(formattedTreeId);
      console.log('Get family tree response:', response);
      
      if (response.data && response.data.success) {
        // Set the selected family tree
        setFamilyTree(response.data.data);
        
        // Fetch the members of this tree
        const membersResponse = await familyService.getFamilyMembersByTreeId(formattedTreeId);
        console.log('Get family members response:', membersResponse);
        
        if (membersResponse.data && membersResponse.data.success) {
          setFamilyMembers(membersResponse.data.data);
        }
      }
    } catch (err) {
      console.error('Error loading family tree:', err);
      setError('Failed to load the selected family tree. Please try again.');
      setContextError('Failed to load the selected family tree. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a family tree
  const handleDeleteTree = async (treeId) => {
    if (window.confirm('Are you sure you want to delete this family tree? This action cannot be undone.')) {
      try {
        setLoading(true);
        await deleteTree(treeId);
        // If the deleted tree was the selected one, clear the selection
        if (treeId === selectedTreeId) {
          setSelectedTreeId(null);
        }
      } catch (err) {
        console.error('Error deleting family tree:', err);
        setError('Failed to delete the family tree. Please try again.');
        alert('Failed to delete the family tree. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Go back to the list of family trees
  const handleBackToList = () => {
    setSelectedTreeId(null);
    setFamilyTree(null);
    setFamilyMembers([]);
  };

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading || contextLoading) {
    return <Loader text="Loading family trees..." />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Always visible */}
      <div className="bg-transparent p-4">
        <div className="container mx-auto flex justify-between items-center">
          {selectedTreeId && treeData ? (
            <>
              <div className="flex items-center">
                <button
                  onClick={handleBackToList}
                  className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {familyTree?.name || 'Family Tree'}
                </h1>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Family Trees</h1>
              <button
                onClick={handleStartNewTree}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Create New Tree
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Tree Visualization View */}
        {selectedTreeId && treeData ? (
          <div className="h-full w-full">
            <FamilyTreeVisualization
              treeData={treeData}
              onNodeClick={handleNodeClick}
              onAddChild={handleAddChild}
              onEditNode={handleEditMember}
              onDeleteNode={handleDeleteMember}
            />
          </div>
        ) : (
          <div className="container mx-auto p-4 md:p-6">
            {/* Family Trees List */}
            {!showNewTreeForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyTrees && familyTrees.length > 0 ? (
                  familyTrees.map((tree) => (
                    <motion.div
                      key={tree.id || tree._id}
                      className="card-glass p-6 rounded-xl hover:shadow-glass-strong transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectTree(tree.id || tree._id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                            {tree.image ? (
                              <img 
                                src={tree.image} 
                                alt={tree.name} 
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-2xl">🌳</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{tree.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Created {formatDate(tree.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(tree.id || tree._id);
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {dropdownOpen === (tree.id || tree._id) && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTree(tree.id || tree._id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  Delete Tree
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {tree.description && (
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                          {tree.description}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-5xl mb-4">🌱</div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Family Trees Yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Start your first family tree to begin documenting your family history and connections.
                    </p>
                    <button
                      onClick={handleStartNewTree}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    >
                      Create Your First Tree
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* New Tree Form */}
            {showNewTreeForm && (
              <motion.div
                className="card-glass p-6 rounded-xl max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Create New Family Tree
                </h2>
                
                <form onSubmit={handleCreateNewTree}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tree Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newTreeData.name}
                      onChange={handleNewTreeInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="e.g. Smith Family Tree"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={newTreeData.description}
                      onChange={handleNewTreeInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="A brief description of your family tree"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowNewTreeForm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Tree'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Member Form - Overlay on top of visualization */}
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {formMode === 'add' ? 'Add Family Member' : 'Edit Family Member'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <FamilyMemberForm
                  mode={formMode}
                  initialData={selectedMember}
                  parentId={parentId}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseForm}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Member Details - Overlay on top of visualization */}
        {showMemberDetails && selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/50 dark:to-secondary-900/50 backdrop-blur-md rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="relative p-6">
                {/* Background animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-[100px] opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-primary-300 via-accent-300 to-secondary-300 dark:from-primary-600 dark:via-accent-600 dark:to-secondary-600 animate-slow-spin rounded-full blur-3xl"></div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {selectedMember.name}
                    </h2>
                    <button
                      onClick={handleCloseDetails}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-center mb-6">
                    {selectedMember.attributes?.photoURL ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3">
                        <img 
                          src={selectedMember.attributes.photoURL} 
                          alt={selectedMember.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-300 border-4 border-white shadow-lg mb-3">
                        {selectedMember.name.charAt(0)}
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
                      {selectedMember.name}
                    </h3>
                  </div>
                  
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedMember.attributes?.gender && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</h4>
                          <p className="text-gray-900 dark:text-gray-100">
                            {selectedMember.attributes.gender.charAt(0).toUpperCase() + selectedMember.attributes.gender.slice(1)}
                          </p>
                        </div>
                      )}
                      
                      {selectedMember.attributes?.dateOfBirth && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Date</h4>
                          <p className="text-gray-900 dark:text-gray-100">
                            {new Date(selectedMember.attributes.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {selectedMember.attributes?.dateOfDeath && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Death Date</h4>
                          <p className="text-gray-900 dark:text-gray-100">
                            {new Date(selectedMember.attributes.dateOfDeath).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {selectedMember.attributes?.location && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h4>
                          <p className="text-gray-900 dark:text-gray-100">{selectedMember.attributes.location}</p>
                        </div>
                      )}
                      
                      {selectedMember.attributes?.occupation && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Occupation</h4>
                          <p className="text-gray-900 dark:text-gray-100">{selectedMember.attributes.occupation}</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedMember.attributes?.bio && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</h4>
                        <p className="text-gray-900 dark:text-gray-100">{selectedMember.attributes.bio}</p>
                      </div>
                    )}
                    
                    {selectedMember.attributes?.contactInfo?.email && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                        <p className="text-gray-900 dark:text-gray-100">{selectedMember.attributes.contactInfo.email}</p>
                      </div>
                    )}
                    
                    {selectedMember.attributes?.contactInfo?.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                        <p className="text-gray-900 dark:text-gray-100">{selectedMember.attributes.contactInfo.phone}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditMember(selectedMember)}
                      className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-colors shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAddChild(selectedMember)}
                      className="px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-lg transition-colors shadow-md"
                    >
                      Add Child
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FamilyTreePage; 



