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
      const response = await familyService.getAllFamilyTrees();
      setFamilyTrees(response.data.data || []);
    } catch (err) {
      console.error('Error fetching all family trees:', err);
      setError('Failed to fetch family trees. Please try again later.');
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
        response = await familyService.getFamilyTreeById(treeId);
        setSelectedTreeId(treeId);
      } else {
        // Fetch all family trees (legacy behavior)
        response = await familyService.getFamilyTree();
      }
      
      setFamilyTree(response.data.data);
      
      // If family tree exists, fetch family members
      if (response.data.data) {
        fetchFamilyMembers(treeId);
      }
    } catch (err) {
      console.error('Error fetching family tree:', err);
      setError('Failed to fetch family tree. Please try again later.');
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
    if (!currentUser) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Creating family tree with data:', familyData);
      const response = await familyService.createFamilyTree(familyData);
      console.log('Create tree response:', response);
      
      // Set the newly created tree as the selected tree
      if (response.data && response.data.data) {
        const newTree = response.data.data;
        console.log('New tree created:', newTree);
        
        // Set the family tree data
        setFamilyTree(newTree);
        
        // Set the selected tree ID - handle both _id and id formats
        const treeId = newTree._id || newTree.id;
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
      }
      
      return {
        success: false,
        error: 'Failed to create family tree'
      };
    } catch (err) {
      console.error('Error creating family tree:', err);
      setError('Failed to create family tree. Please try again later.');
      return {
        success: false,
        error: err.message || 'Failed to create family tree'
      };
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchAllFamilyTrees]);

  // Add a new family member
  const addMember = useCallback(async (memberData) => {
    if (!currentUser) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Make sure we have a selected tree ID
      if (!selectedTreeId) {
        console.error('No selected tree ID when trying to add member');
        setError('No family tree selected. Please select or create a family tree first.');
        return {
          success: false,
          error: 'No family tree selected'
        };
      }
      
      console.log('Adding member to tree:', selectedTreeId, memberData);
      
      // Use the selected tree ID - ensure it's a string
      const treeId = String(selectedTreeId).trim();
      console.log('Using formatted treeId:', treeId);
      
      const response = await familyService.addChild(memberData, treeId);
      console.log('Add member response:', response);
      
      // Refresh family tree data
      await fetchFamilyTree(treeId);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      console.error('Error adding family member:', err);
      setError('Failed to add family member. Please try again later.');
      return {
        success: false,
        error: err.message || 'Failed to add family member'
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
    if (familyTree && familyMembers.length > 0) {
      // Build hierarchical tree structure for visualization
      const processedData = buildFamilyTree(familyMembers);
      setTreeData(processedData);
    } else {
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