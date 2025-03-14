// File: src/pages/FamilyTreePage.jsx
// Family tree page with visualization and member management

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFamily } from '../hooks/useFamily';
import FamilyTreeVisualization from '../components/family/FamilyTreeVisualization';
import FamilyMemberForm from '../components/family/FamilyMemberForm';
import { buildFamilyTree } from '../utils/treeHelpers';
import { demoFamilyMembers } from '../utils/demoData';
import '../styles/treeStyles.css';

const FamilyTreePage = () => {
  const { 
    familyTree, 
    loading, 
    error, 
    fetchFamilyTree, 
    addMember, 
    updateMember, 
    removeMember 
  } = useFamily();
  
  const [treeData, setTreeData] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [parentId, setParentId] = useState(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo family tree data
  useEffect(() => {
    const loadDemoData = async () => {
      setIsLoading(true);
      try {
        // Use demo data instead of API call
        const processedData = buildFamilyTree(demoFamilyMembers);
        setTreeData(processedData);
      } catch (err) {
        console.error('Error loading family tree data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDemoData();
  }, []);

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
  const handleDeleteMember = (nodeDatum) => {
    if (window.confirm(`Are you sure you want to delete ${nodeDatum.name}?`)) {
      // In demo mode, just filter out the member from the tree
      // This is a simplified approach for demo purposes
      const updatedMembers = demoFamilyMembers.filter(member => member.id !== nodeDatum.id);
      const processedData = buildFamilyTree(updatedMembers);
      setTreeData(processedData);
      
      // Close any open panels
      setSelectedMember(null);
      setShowMemberDetails(false);
      setShowForm(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = (memberData) => {
    if (formMode === 'add') {
      // Create a new member with demo data
      const newMember = {
        id: `member-${Date.now()}`,
        name: memberData.name,
        gender: memberData.gender,
        birthDate: memberData.birthDate,
        deathDate: memberData.deathDate || null,
        photo: memberData.photo || null,
        parentId: parentId,
        // Add other fields as needed
      };
      
      // Add to demo data and rebuild tree
      const updatedMembers = [...demoFamilyMembers, newMember];
      const processedData = buildFamilyTree(updatedMembers);
      setTreeData(processedData);
    } else if (formMode === 'edit' && selectedMember) {
      // Update the member in demo data
      const updatedMembers = demoFamilyMembers.map(member => {
        if (member.id === selectedMember.id) {
          return {
            ...member,
            name: memberData.name,
            gender: memberData.gender,
            birthDate: memberData.birthDate,
            deathDate: memberData.deathDate || null,
            photo: memberData.photo || null,
            // Update other fields as needed
          };
        }
        return member;
      });
      
      // Rebuild tree with updated data
      const processedData = buildFamilyTree(updatedMembers);
      setTreeData(processedData);
    }
    
    // Close form and reset state
    setShowForm(false);
    setSelectedMember(null);
    setParentId(null);
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
    setFormMode('add');
    setParentId(null);
    setShowForm(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      {/* <div className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Family Tree</h1>
          <button
            onClick={handleStartNewTree}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            {treeData ? 'Add Root Member' : 'Start Family Tree'}
          </button>
        </div>
      </div>
       */}
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tree visualization */}
        <div className="flex-1 p-4 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : !treeData ? (
            <motion.div 
              className="flex flex-col items-center justify-center h-full text-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Start Your Family Tree</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                Create a digital family tree to preserve your family history and share it with generations to come.
              </p>
              <motion.button 
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-lg"
                onClick={handleStartNewTree}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Family Member
              </motion.button>
            </motion.div>
          ) : (
            <div className="tree-container">
              <FamilyTreeVisualization
                onNodeClick={handleNodeClick}
                onAddChild={handleAddChild}
                onEditNode={handleEditMember}
                onDeleteNode={handleDeleteMember}
              />
            </div>
          )}
        </div>
        
        {/* Side panel */}
        <motion.div 
          className={`w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto ${
            showMemberDetails || showForm ? 'block' : 'hidden'
          }`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {showMemberDetails && selectedMember && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Member Details</h2>
                <button 
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-6">
                {selectedMember.attributes?.imageUrl ? (
                  <img 
                    src={selectedMember.attributes.imageUrl} 
                    alt={selectedMember.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 text-4xl font-semibold border-4 border-white shadow-lg">
                    {selectedMember.name.charAt(0)}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4">{selectedMember.name}</h3>
                {selectedMember.attributes?.relationship && (
                  <p className="text-gray-500 dark:text-gray-400">{selectedMember.attributes.relationship}</p>
                )}
              </div>
              
              <div className="space-y-4">
                {selectedMember.attributes?.birthDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Date</h4>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(selectedMember.attributes.birthDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {selectedMember.attributes?.deathDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Death Date</h4>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(selectedMember.attributes.deathDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {selectedMember.attributes?.gender && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</h4>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedMember.attributes.gender.charAt(0).toUpperCase() + selectedMember.attributes.gender.slice(1)}
                    </p>
                  </div>
                )}
                
                {selectedMember.attributes?.location && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h4>
                    <p className="text-gray-900 dark:text-gray-100">{selectedMember.attributes.location}</p>
                  </div>
                )}
                
                {selectedMember.attributes?.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</h4>
                    <p className="text-gray-900 dark:text-gray-100">{selectedMember.attributes.bio}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex space-x-3">
                <button
                  onClick={() => handleEditMember(selectedMember)}
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleAddChild(selectedMember)}
                  className="flex-1 px-4 py-2 border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  Add Child
                </button>
              </div>
            </div>
          )}
          
          {showForm && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {formMode === 'add' ? 'Add Family Member' : 'Edit Family Member'}
                </h2>
                <button 
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <FamilyMemberForm 
                mode={formMode}
                initialData={selectedMember}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseForm}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FamilyTreePage; 