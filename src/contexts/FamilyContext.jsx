// File: src/contexts/FamilyContext.jsx
// Context for managing family tree data

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import familyService from '../services/familyService';
import { buildFamilyTree } from '../utils/treeHelpers';

// Create context
const FamilyContext = createContext();

export function useFamily() {
  return useContext(FamilyContext);
}

export function FamilyProvider({ children }) {
  const { currentUser } = useAuth();
  const [familyTree, setFamilyTree] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyTrees, setFamilyTrees] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [treeData, setTreeData] = useState(null);

  // Fetch all family trees for the user
  const fetchAllFamilyTrees = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching all family trees for user:', currentUser.uid);
      const response = await familyService.getAllFamilyTrees();
      console.log('fetchAllFamilyTrees response:', response);
      
      if (response && response.success !== false) {
        // Handle different response formats
        const trees = response.data || [];
        console.log('Setting family trees:', trees);
        setFamilyTrees(trees);
      } else {
        console.error('Failed to fetch family trees:', response?.message || 'Unknown error');
        setError(response?.message || 'Failed to fetch family trees. Please try again later.');
        setFamilyTrees([]);
      }
    } catch (err) {
      console.error('Error fetching all family trees:', err);
      setError('Failed to fetch family trees. Please try again later.');
      setFamilyTrees([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch family tree data
  const fetchFamilyTree = useCallback(async (treeId) => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (treeId) {
        // Fetch a specific family tree
        console.log('Fetching family tree by ID:', treeId);
        response = await familyService.getFamilyTreeById(treeId);
        setSelectedTreeId(treeId);
      } else {
        // Fetch all family trees (legacy behavior)
        console.log('Fetching default family tree');
        response = await familyService.getFamilyTree();
      }
      
      console.log('Family tree response:', response);
      
      if (!response || !response.data || !response.data.data) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }
      
      // Set the family tree data
      const familyTreeData = response.data.data;
      setFamilyTree(familyTreeData);
      
      // Extract members from the family tree data
      // Check for members in both 'members' and 'children' arrays
      let membersArray = [];
      
      if (familyTreeData && familyTreeData.members && familyTreeData.members.length > 0) {
        console.log('Extracting members from family tree data:', familyTreeData.members.length);
        membersArray = familyTreeData.members;
      } else if (familyTreeData && familyTreeData.children && familyTreeData.children.length > 0) {
        // Handle case where members are in the 'children' array instead of 'members'
        console.log('Extracting members from children array:', familyTreeData.children.length);
        membersArray = familyTreeData.children;
      } else {
        console.log('No members or children found in family tree data');
        setFamilyMembers([]);
        return;
      }
      
      // Format the members data
      const formattedMembers = membersArray.map(member => ({
        id: member._id,
        name: `${member.firstName || ''} ${member.lastName || ''}`.trim(),
        firstName: member.firstName,
        lastName: member.lastName,
        gender: member.gender,
        birthDate: member.birthDate,
        dateOfBirth: member.birthDate,
        deathDate: member.deathDate,
        dateOfDeath: member.deathDate,
        isAlive: member.isAlive,
        relationshipType: member.relationshipType,
        parentId: member.parents && member.parents.length > 0 ? member.parents[0] : null,
        parents: member.parents || [],
        spouses: member.partners || [],
        partners: member.partners || [],
        children: member.children || [],
        location: member.location,
        occupation: member.occupation,
        bio: member.bio || member.notes,
        notes: member.notes || member.bio,
        photoURL: member.photoURL || member.profilePicture,
        profilePicture: member.profilePicture || member.photoURL,
        contactInfo: member.contactInfo
      }));
      
      console.log('Formatted members:', formattedMembers);
      setFamilyMembers(formattedMembers);
    } catch (err) {
      console.error('Error fetching family tree:', err);
      setError('Failed to fetch family tree. Please try again later.');
      setFamilyTree(null);
      setFamilyMembers([]);
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch family members
  const fetchFamilyMembers = useCallback(async (treeId) => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (treeId) {
        // Fetch members for a specific tree
        response = await familyService.getFamilyMembersByTreeId(treeId);
      } else {
        // Fetch members for the default tree (legacy behavior)
        response = await familyService.getFamilyMembers();
      }
      
      setFamilyMembers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching family members:', err);
      setError('Failed to fetch family members. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Create a new family tree
  const createTree = useCallback(async (familyData) => {
    if (!currentUser) return { success: false, message: 'User not authenticated' };
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Creating family tree with data:', familyData);
      const response = await familyService.createFamilyTree(familyData);
      console.log('Create tree response:', response);
      
      // Check if the response is successful
      if (!response.success) {
        console.error('API returned error:', response.message);
        return { 
          success: false, 
          message: response.message || 'Failed to create family tree' 
        };
      }
      
      // Extract the tree data from the response
      const newTree = response.data;
      
      if (!newTree) {
        console.error('No tree data in response');
        return { 
          success: false, 
          message: 'No tree data returned from server' 
        };
      }
      
      console.log('New tree created:', newTree);
      
      // Set the family tree data
      setFamilyTree(newTree);
      
      // Set the selected tree ID - handle both _id and id formats
      const treeId = newTree._id || newTree.id;
      
      if (!treeId) {
        console.error('No tree ID in response data');
        return { 
          success: false, 
          message: 'No tree ID returned from server' 
        };
      }
      
      console.log('Setting selected tree ID to:', treeId);
      setSelectedTreeId(treeId);
      
      // Initialize empty family members array for the new tree
      setFamilyMembers([]);
      
      // Refresh the list of family trees
      await fetchAllFamilyTrees();
      
      return {
        success: true,
        data: newTree,
        treeId: treeId
      };
    } catch (err) {
      console.error('Error creating family tree:', err);
      setError('Failed to create family tree. Please try again later.');
      return {
        success: false,
        message: err.message || 'Failed to create family tree'
      };
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchAllFamilyTrees]);

  // Add a new family member
  const addMember = useCallback(async (memberData, treeId = null) => {
    if (!currentUser) return { success: false, message: 'User not authenticated' };
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the provided tree ID or the selected tree ID
      const targetTreeId = treeId || selectedTreeId;
      
      // Make sure we have a tree ID
      if (!targetTreeId) {
        console.error('No tree ID provided when trying to add member');
        setError('No family tree selected. Please select or create a family tree first.');
        return {
          success: false,
          message: 'No family tree selected'
        };
      }
      
      // Format the tree ID to ensure it's a string and trimmed
      const formattedTreeId = String(targetTreeId).trim();
      console.log('Adding member to tree:', formattedTreeId, memberData);
      
      // Call the service to add the member
      const response = await familyService.addMember(memberData, formattedTreeId);
      console.log('Add member response:', response);
      
      if (!response.success) {
        console.error('API returned error:', response.message);
        return {
          success: false,
          message: response.message || 'Failed to add family member'
        };
      }
      
      // Refresh family tree data
      await fetchFamilyTree(formattedTreeId);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      console.error('Error adding family member:', err);
      setError('Failed to add family member. Please try again later.');
      return {
        success: false,
        message: err.message || 'Failed to add family member'
      };
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchFamilyTree, selectedTreeId]);

  // Update a family member
  const updateMember = useCallback(async (childId, updateData) => {
    if (!currentUser || !childId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the selected tree ID if available
      const response = await familyService.updateChild(childId, updateData, selectedTreeId);
      
      // Refresh family tree data
      fetchFamilyTree(selectedTreeId);
      
      return response.data;
    } catch (err) {
      console.error(`Error updating family member ${childId}:`, err);
      setError('Failed to update family member. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchFamilyTree, selectedTreeId]);

  // Delete a family member
  const removeMember = useCallback(async (childId) => {
    if (!currentUser || !childId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the selected tree ID if available
      await familyService.deleteChild(childId, selectedTreeId);
      
      // Refresh family tree data
      fetchFamilyTree(selectedTreeId);
      
      // If the deleted member was selected, clear selection
      if (selectedMember && selectedMember.id === childId) {
        setSelectedMember(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Error deleting family member ${childId}:`, err);
      setError('Failed to delete family member. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchFamilyTree, selectedMember, selectedTreeId]);

  // Delete the entire family tree
  const deleteTree = useCallback(async (treeId) => {
    if (!currentUser) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the provided tree ID or the selected tree ID
      const targetTreeId = treeId || selectedTreeId;
      await familyService.deleteFamilyTree(targetTreeId);
      
      // Clear state if the deleted tree was the selected one
      if (!treeId || treeId === selectedTreeId) {
        setFamilyTree(null);
        setFamilyMembers([]);
        setSelectedMember(null);
        setTreeData(null);
        setSelectedTreeId(null);
      }
      
      // Refresh the list of family trees
      fetchAllFamilyTrees();
      
      return true;
    } catch (err) {
      console.error('Error deleting family tree:', err);
      setError('Failed to delete family tree. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchAllFamilyTrees, selectedTreeId]);

  // Process family tree data for visualization
  useEffect(() => {
    if (familyTree && familyMembers) {
      console.log('Processing family tree data for visualization');
      console.log('Family tree:', familyTree);
      console.log('Family members:', familyMembers);
      
      try {
        // Check if we have any members to process
        if (familyMembers.length === 0) {
          console.log('No family members to process');
          setTreeData(null);
          return;
        }
        
        // Log the number of members for debugging
        console.log(`Processing ${familyMembers.length} family members for visualization`);
        
        // Build hierarchical tree structure for visualization
        const processedData = buildFamilyTree(familyMembers);
        console.log('Processed tree data:', processedData);
        
        if (processedData) {
          setTreeData(processedData);
        } else {
          console.log('No processed data returned from buildFamilyTree');
          setTreeData(null);
        }
      } catch (error) {
        console.error('Error processing family tree data:', error);
        setTreeData(null);
        setError('Failed to process family tree data. Please try again later.');
      }
    } else {
      console.log('No family tree or members to process');
      setTreeData(null);
    }
  }, [familyTree, familyMembers]);

  // Load family trees when user changes
  useEffect(() => {
    if (currentUser) {
      fetchAllFamilyTrees();
    } else {
      setFamilyTree(null);
      setFamilyMembers([]);
      setFamilyTrees([]);
      setSelectedMember(null);
      setSelectedTreeId(null);
      setTreeData(null);
    }
  }, [currentUser, fetchAllFamilyTrees]);

  // Context value
  const value = {
    familyTree,
    familyMembers,
    familyTrees,
    selectedMember,
    selectedTreeId,
    treeData,
    loading,
    error,
    fetchFamilyTree,
    fetchFamilyMembers,
    fetchAllFamilyTrees,
    createTree,
    addMember,
    updateMember,
    removeMember,
    deleteTree,
    setSelectedMember,
    setSelectedTreeId,
    setFamilyTree,
    setFamilyMembers,
    setError
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
}

export default FamilyContext; 