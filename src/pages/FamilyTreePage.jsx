// File: src/pages/FamilyTreePage.jsx
// Family tree page with visualization and member management

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFamily } from '../hooks/useFamily';
import FamilyTreeVisualization from '../components/family/FamilyTreeVisualization';
import FamilyMemberForm from '../components/family/FamilyMemberForm';
import { buildFamilyTree } from '../utils/treeHelpers';

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

  // Process family tree data for visualization
  useEffect(() => {
    if (familyTree) {
      // Convert the family tree data to the format expected by react-d3-tree
      const processedData = buildFamilyTree(familyTree);
      setTreeData(processedData);
    }
  }, [familyTree]);

  // Handle node click in the tree visualization
  const handleNodeClick = (nodeDatum) => {
    setSelectedMember(nodeDatum);
    setShowMemberDetails(true);
    setShowForm(false);
  };

  // Handle adding a child to a member
  const handleAddChild = (parentNode) => {
    setParentId(parentNode.member_id);
    setSelectedMember(null);
    setFormMode('add');
    setShowForm(true);
    setShowMemberDetails(false);
  };

  // Handle editing a member
  const handleEditMember = (member) => {
    setSelectedMember(member);
    setFormMode('edit');
    setShowForm(true);
    setShowMemberDetails(false);
  };

  // Handle deleting a member
  const handleDeleteMember = async (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      try {
        await removeMember(member.member_id);
        setSelectedMember(null);
        setShowMemberDetails(false);
        // Refresh the tree data
        await fetchFamilyTree();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  // Handle form submission
  const handleFormSubmit = async (memberData, id) => {
    try {
      if (formMode === 'add') {
        await addMember(id, memberData);
      } else {
        await updateMember(id, memberData);
      }
      
      setShowForm(false);
      // Refresh the tree data
      await fetchFamilyTree();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedMember(null);
  };

  // Handle creating a new family tree
  const handleCreateTree = () => {
    setParentId(null);
    setSelectedMember(null);
    setFormMode('add');
    setShowForm(true);
    setShowMemberDetails(false);
  };

  // Animated blob backgrounds
  const AnimatedBlobs = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.div 
        className="absolute top-20 left-10 w-96 h-96 bg-primary-300 opacity-20 rounded-full filter blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-40 right-20 w-96 h-96 bg-secondary-300 opacity-20 rounded-full filter blur-3xl"
        animate={{ 
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent-300 opacity-20 rounded-full filter blur-3xl"
        animate={{ 
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut"
        }}
      />
    </div>
  );

  // Render member details panel
  const renderMemberDetails = () => {
    if (!selectedMember) return null;
    
    const { name, attributes = {} } = selectedMember;
    
    return (
      <div className="card-glass p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleEditMember(selectedMember)}
              className="p-2 text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              aria-label="Edit member"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              onClick={() => handleDeleteMember(selectedMember)}
              className="p-2 text-error hover:text-error-dark focus:outline-none focus:ring-2 focus:ring-error rounded"
              aria-label="Delete member"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Profile image */}
        {attributes.imageUrl && (
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 shadow-md">
              <img 
                src={attributes.imageUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        {/* Basic information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium border-b border-neutral-200/50 pb-2 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.gender && (
              <div>
                <p className="text-sm text-neutral-500">Gender</p>
                <p className="font-medium">{attributes.gender}</p>
              </div>
            )}
            
            {attributes.birthPlace && (
              <div>
                <p className="text-sm text-neutral-500">Birth Place</p>
                <p className="font-medium">{attributes.birthPlace}</p>
              </div>
            )}
            
            {attributes.birthDate && (
              <div>
                <p className="text-sm text-neutral-500">Birth Date</p>
                <p className="font-medium">{new Date(attributes.birthDate).toLocaleDateString()}</p>
              </div>
            )}
            
            {attributes.deathDate && (
              <div>
                <p className="text-sm text-neutral-500">Death Date</p>
                <p className="font-medium">{new Date(attributes.deathDate).toLocaleDateString()}</p>
              </div>
            )}
            
            {attributes.occupation && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm text-neutral-500">Occupation</p>
                <p className="font-medium">{attributes.occupation}</p>
              </div>
            )}
          </div>
          
          {attributes.bio && (
            <div className="mt-4">
              <p className="text-sm text-neutral-500">Biography</p>
              <p className="mt-1">{attributes.bio}</p>
            </div>
          )}
        </div>
        
        {/* Contact information */}
        {(attributes.email || attributes.phone || attributes.address) && (
          <div className="mb-6">
            <h3 className="text-lg font-medium border-b border-neutral-200/50 pb-2 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attributes.email && (
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-medium">{attributes.email}</p>
                </div>
              )}
              
              {attributes.phone && (
                <div>
                  <p className="text-sm text-neutral-500">Phone</p>
                  <p className="font-medium">{attributes.phone}</p>
                </div>
              )}
            </div>
            
            {attributes.address && (
              <div className="mt-4">
                <p className="text-sm text-neutral-500">Address</p>
                <p className="mt-1">{attributes.address}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Social media */}
        {attributes.socialMedia && Object.values(attributes.socialMedia).some(value => value) && (
          <div>
            <h3 className="text-lg font-medium border-b border-neutral-200/50 pb-2 mb-4">Social Media</h3>
            
            <div className="flex flex-wrap gap-4">
              {attributes.socialMedia.facebook && (
                <a 
                  href={attributes.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                  aria-label="Facebook profile"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              
              {attributes.socialMedia.twitter && (
                <a 
                  href={attributes.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-sm"
                  aria-label="Twitter profile"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
              
              {attributes.socialMedia.instagram && (
                <a 
                  href={attributes.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 shadow-sm"
                  aria-label="Instagram profile"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              
              {attributes.socialMedia.linkedin && (
                <a 
                  href={attributes.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 shadow-sm"
                  aria-label="LinkedIn profile"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => handleAddChild(selectedMember)}
            className="btn-primary"
          >
            Add Child
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Animated background blobs */}
      <AnimatedBlobs />
      
      <header className="header-glass px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900">Family <span className="text-gradient">Tree</span></h1>
          <button 
            onClick={handleCreateTree}
            className="btn-primary"
          >
            {familyTree ? 'Add Root Member' : 'Create Family Tree'}
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {error && (
          <div className="alert-error m-4">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="h-full flex flex-col lg:flex-row">
            {/* Tree visualization */}
            <div className={`flex-1 overflow-hidden ${(showForm || showMemberDetails) ? 'hidden lg:block' : ''}`}>
              <FamilyTreeVisualization
                treeData={treeData}
                onNodeClick={handleNodeClick}
                onAddChild={handleAddChild}
                onEditNode={handleEditMember}
                onDeleteNode={handleDeleteMember}
              />
            </div>
            
            {/* Side panel */}
            <div className={`w-full lg:w-1/3 xl:w-1/4 border-l border-neutral-200/30 overflow-y-auto ${(!showForm && !showMemberDetails) ? 'hidden lg:block' : ''}`}>
              {showForm && (
                <FamilyMemberForm
                  member={formMode === 'edit' ? selectedMember : null}
                  parentId={parentId}
                  isEdit={formMode === 'edit'}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              )}
              
              {showMemberDetails && renderMemberDetails()}
              
              {!showForm && !showMemberDetails && (
                <div className="p-6 text-center">
                  <p className="text-neutral-600">Select a family member to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FamilyTreePage; 